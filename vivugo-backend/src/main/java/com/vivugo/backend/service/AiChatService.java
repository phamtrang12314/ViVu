package com.vivugo.backend.service;

import com.vivugo.backend.dto.ChatMessage;
import com.vivugo.backend.dto.ChatResponse;
import com.vivugo.backend.model.Destination;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.model.TourDestination;
import com.vivugo.backend.model.enums.TourStatus;
import com.vivugo.backend.repository.TourRepository;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AiChatService {

    private static final Pattern DIACRITICS = Pattern.compile("\\p{M}+");
    private static final Pattern MILLION_BUDGET_PATTERN = Pattern.compile("(\\d+(?:[\\.,]\\d+)?)\\s*(tr|trieu|triệu)");
    private static final Pattern THOUSAND_BUDGET_PATTERN = Pattern.compile("(\\d+(?:[\\.,]\\d+)?)\\s*(k|ngan|ngàn)");
    private static final Pattern NUMBER_PATTERN = Pattern.compile("\\b\\d{6,10}\\b");

    private final TourRepository tourRepository;
    private final RecommendationService recommendationService;
    private final AiProviderClient aiProviderClient;

    public AiChatService(
            TourRepository tourRepository,
            RecommendationService recommendationService,
            AiProviderClient aiProviderClient
    ) {
        this.tourRepository = tourRepository;
        this.recommendationService = recommendationService;
        this.aiProviderClient = aiProviderClient;
    }

    @Transactional(readOnly = true)
    public ChatResponse getChatResponse(List<ChatMessage> messages, String sessionId, Authentication authentication) {
        if (messages == null || messages.isEmpty()) {
            messages = List.of(new ChatMessage("user", "Tư vấn tour phù hợp"));
        }

        String userQuestion = safe(messages.get(messages.size() - 1).getContent());
        String normalizedQuestion = normalize(userQuestion);
        String intent = detectIntent(normalizedQuestion);

        List<Map<String, Object>> displayData = new ArrayList<>();
        String systemInstruction = buildBaseInstruction();
        String fallbackReply;

        switch (intent) {
            case "AUTH_HELP" -> {
                systemInstruction += "\nKhách đang hỏi đăng ký, đăng nhập, OTP hoặc quên mật khẩu. Trả lời đúng luồng tài khoản của ViVuGo.";
                fallbackReply = answerAuthHelp(normalizedQuestion);
            }
            case "BOOKING_GUIDE" -> {
                systemInstruction += "\nKhách đang hỏi cách đặt tour. Hướng dẫn theo từng bước trên website ViVuGo, không gợi ý tour nếu khách chưa hỏi tour cụ thể.";
                fallbackReply = answerBookingGuide();
            }
            case "TRAVEL_TIPS" -> {
                systemInstruction += "\nKhách đang hỏi lưu ý khi đi tour. Trả lời thực tế, ngắn gọn, có checklist.";
                fallbackReply = answerTravelTips(normalizedQuestion);
            }
            case "POLICY" -> {
                systemInstruction += "\nDữ kiện ViVuGo: thanh toán xác nhận sau giao dịch thành công; hủy/hoàn tiền phụ thuộc trạng thái booking và admin duyệt; giá trẻ em tùy tour. Không tự bịa phần trăm hoàn tiền.";
                fallbackReply = answerPolicy(normalizedQuestion);
            }
            case "TOUR_SEARCH" -> {
                SearchCriteria criteria = parseSearchCriteria(userQuestion, normalizedQuestion);
                TourSearchResult result = searchTours(criteria, sessionId, authentication, 5);
                displayData = toDisplayData(result.tours());
                fallbackReply = buildTourSearchReply(criteria, result);

                systemInstruction += "\nKhách đang tìm tour. Backend đã lọc tour theo điều kiện và UI sẽ hiển thị thẻ tour.";
                systemInstruction += "\nNếu exactMatch=false, bắt buộc nói rõ hiện chưa có tour đúng điều kiện trước khi giới thiệu tour tương tự.";
                systemInstruction += "\nĐiều kiện khách hỏi: " + criteria.describeForPrompt();
                systemInstruction += "\nKết quả: exactMatch=" + result.exactMatch()
                        + ", reason=" + result.reason()
                        + ", tours=" + result.tours().stream().map(this::tourLine).toList();
            }
            default -> {
                displayData = recommendationService.recommendForChat(sessionId, authentication, 4)
                        .stream()
                        .map(this::summaryToMap)
                        .toList();
                systemInstruction += "\nKhách hỏi chung. Trả lời đúng câu hỏi, sau đó hỏi thêm vùng miền, ngân sách, ngày đi và số người nếu cần.";
                fallbackReply = "Mình có thể tư vấn tour theo vùng miền, ngân sách, ngày khởi hành và số người đi. Bạn muốn đi miền Bắc, miền Trung hay miền Nam, và ngân sách khoảng bao nhiêu?";
            }
        }

        String aiReply = aiProviderClient.callCustomerChat(systemInstruction, messages, fallbackReply);
        return new ChatResponse(aiReply, displayData);
    }

    private String detectIntent(String normalizedText) {
        if (containsAny(normalizedText, "dang ky", "dang nhap", "quen mat khau", "otp", "tai khoan", "mat khau")) {
            return "AUTH_HELP";
        }
        if (containsAny(normalizedText, "dat tour", "dat ve", "book tour", "booking", "huong dan dat", "cach dat")) {
            return "BOOKING_GUIDE";
        }
        if (containsAny(normalizedText, "luu y", "can chuan bi", "hanh ly", "mang theo", "kinh nghiem", "di tour can")) {
            return "TRAVEL_TIPS";
        }
        if (containsAny(normalizedText, "huy", "hoan tien", "thanh toan", "chinh sach", "tre em", "dat coc")) {
            return "POLICY";
        }
        if (containsAny(normalizedText, "tour", "du lich", "di choi", "di dau", "gia", "ngan sach", "mien bac", "mien trung", "mien nam")
                || extractLocation(normalizedText) != null
                || parseBudget(normalizedText) != null) {
            return "TOUR_SEARCH";
        }
        return "GENERAL";
    }

    private TourSearchResult searchTours(SearchCriteria criteria, String sessionId, Authentication authentication, int size) {
        List<Tour> activeTours = tourRepository.findByStatus(TourStatus.ACTIVE).stream()
                .filter(this::isCustomerVisibleTour)
                .toList();
        if (activeTours.isEmpty()) {
            return new TourSearchResult(false, "NO_ACTIVE_TOUR", List.of());
        }

        List<Tour> exactMatches = activeTours.stream()
                .filter(tour -> matchesRegion(tour, criteria.region()))
                .filter(tour -> matchesLocation(tour, criteria.location()))
                .filter(tour -> matchesBudget(tour, criteria.maxBudget()))
                .sorted(sortByBudgetAndRanking(criteria.maxBudget()))
                .limit(size)
                .toList();

        if (!exactMatches.isEmpty()) {
            return new TourSearchResult(true, "EXACT", exactMatches);
        }

        List<Tour> samePlaceOrRegion = activeTours.stream()
                .filter(tour -> matchesRegion(tour, criteria.region()))
                .filter(tour -> matchesLocation(tour, criteria.location()))
                .sorted(sortByBudgetAndRanking(criteria.maxBudget()))
                .limit(size)
                .toList();
        if (!samePlaceOrRegion.isEmpty()) {
            return new TourSearchResult(false, "NO_BUDGET_MATCH", samePlaceOrRegion);
        }

        if (criteria.maxBudget() != null) {
            List<Tour> sameBudget = activeTours.stream()
                    .filter(tour -> matchesBudget(tour, criteria.maxBudget()))
                    .sorted(sortByBudgetAndRanking(criteria.maxBudget()))
                    .limit(size)
                    .toList();
            if (!sameBudget.isEmpty()) {
                return new TourSearchResult(false, "NO_REGION_MATCH", sameBudget);
            }
        }

        List<Tour> personalized = recommendationService.getPersonalizedTours(sessionId, authentication, size)
                .getTours()
                .stream()
                .map(summary -> tourRepository.findById(summary.getTourID()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
        if (!personalized.isEmpty()) {
            return new TourSearchResult(false, "PERSONALIZED_FALLBACK", personalized);
        }

        return new TourSearchResult(false, "POPULAR_FALLBACK", activeTours.stream()
                .sorted(sortByBudgetAndRanking(criteria.maxBudget()))
                .limit(size)
                .toList());
    }

    private SearchCriteria parseSearchCriteria(String rawQuestion, String normalizedQuestion) {
        String location = extractLocation(normalizedQuestion);
        String region = extractRegion(normalizedQuestion, location);
        Double budget = parseBudget(normalizedQuestion);
        return new SearchCriteria(region, location, budget, rawQuestion);
    }

    private Double parseBudget(String normalizedQuestion) {
        Matcher millionMatcher = MILLION_BUDGET_PATTERN.matcher(normalizedQuestion);
        if (millionMatcher.find()) {
            return parseFlexibleNumber(millionMatcher.group(1)) * 1_000_000;
        }

        Matcher thousandMatcher = THOUSAND_BUDGET_PATTERN.matcher(normalizedQuestion);
        if (thousandMatcher.find()) {
            return parseFlexibleNumber(thousandMatcher.group(1)) * 1_000;
        }

        Matcher numberMatcher = NUMBER_PATTERN.matcher(normalizedQuestion.replace(".", "").replace(",", ""));
        if (numberMatcher.find()) {
            return Double.parseDouble(numberMatcher.group());
        }
        return null;
    }

    private double parseFlexibleNumber(String value) {
        return Double.parseDouble(value.replace(",", "."));
    }

    private String extractRegion(String normalizedText, String location) {
        if (normalizedText.contains("mien nam")) return "mien nam";
        if (normalizedText.contains("mien trung")) return "mien trung";
        if (normalizedText.contains("mien bac")) return "mien bac";

        if (location == null) {
            return null;
        }
        if (List.of("phu quoc", "can tho", "sai gon", "ho chi minh", "hcm", "vung tau", "dong thap", "bac lieu", "ben tre", "ca mau", "tay ninh").contains(location)) {
            return "mien nam";
        }
        if (List.of("da nang", "hoi an", "hue", "nha trang", "phu yen", "quang binh", "quang tri", "da lat").contains(location)) {
            return "mien trung";
        }
        if (List.of("sapa", "sa pa", "ha long", "ha noi", "ninh binh", "mai chau", "moc chau", "ha giang", "cat ba").contains(location)) {
            return "mien bac";
        }
        return null;
    }

    private String extractLocation(String text) {
        String[] locations = {
                "da lat", "nha trang", "da nang", "phu quoc", "sapa", "sa pa", "ha long",
                "ha noi", "hoi an", "hue", "vung tau", "ninh binh", "mai chau", "moc chau",
                "can tho", "sai gon", "ho chi minh", "hcm", "ha giang", "cat ba", "quang binh",
                "quang tri", "phu yen", "tay ninh", "dong thap", "bac lieu", "ben tre", "ca mau"
        };
        for (String location : locations) {
            if (text.contains(location)) {
                return location;
            }
        }
        return null;
    }

    private boolean matchesRegion(Tour tour, String region) {
        if (region == null || region.isBlank()) {
            return true;
        }
        return tourText(tour).contains(region);
    }

    private boolean matchesLocation(Tour tour, String location) {
        if (location == null || location.isBlank()) {
            return true;
        }
        return tourText(tour).contains(location);
    }

    private boolean matchesBudget(Tour tour, Double maxBudget) {
        if (maxBudget == null) {
            return true;
        }
        return tour.getPriceAdult() != null && tour.getPriceAdult() <= maxBudget;
    }

    private Comparator<Tour> sortByBudgetAndRanking(Double budget) {
        return Comparator
                .comparing((Tour tour) -> budgetDistance(tour, budget))
                .thenComparing(this::safeRanking)
                .thenComparing(Tour::getTitle);
    }

    private double budgetDistance(Tour tour, Double budget) {
        if (budget == null || tour.getPriceAdult() == null) {
            return 0.0;
        }
        return Math.abs(tour.getPriceAdult() - budget);
    }

    private String buildTourSearchReply(SearchCriteria criteria, TourSearchResult result) {
        if (result.tours().isEmpty()) {
            return "Hiện ViVuGo chưa có tour phù hợp với điều kiện này. Bạn có thể cho mình biết thêm nơi muốn đi, số người và ngày khởi hành để mình lọc lại chính xác hơn.";
        }

        String condition = criteria.humanCondition();
        String firstTour = result.tours().get(0).getTitle();
        String firstPrice = formatMoney(result.tours().get(0).getPriceAdult());

        if (result.exactMatch()) {
            return "Mình tìm thấy tour phù hợp với " + condition + ". Bạn xem các tour bên dưới nhé; gợi ý đầu tiên là " + firstTour + " khoảng " + firstPrice + ".";
        }

        return switch (result.reason()) {
            case "NO_BUDGET_MATCH" -> "Hiện ViVuGo chưa có tour " + condition + ". Mình đề xuất vài tour cùng khu vực có giá gần nhất để bạn cân nhắc, ví dụ " + firstTour + " khoảng " + firstPrice + ".";
            case "NO_REGION_MATCH" -> "Hiện ViVuGo chưa có tour đúng khu vực bạn hỏi với ngân sách đó. Mình gợi ý các tour trong tầm giá tương tự trước, rồi bạn có thể nới ngân sách hoặc đổi vùng nếu muốn.";
            default -> "Mình chưa tìm thấy tour khớp hoàn toàn với " + condition + ". Dưới đây là vài lựa chọn gần nhất dựa trên tour nổi bật và lịch sử xem của bạn.";
        };
    }

    private String answerAuthHelp(String normalizedQuestion) {
        if (normalizedQuestion.contains("quen mat khau")) {
            return "Để lấy lại mật khẩu, bạn vào Đăng nhập -> Quên mật khẩu, nhập email tài khoản, nhận mã OTP trong email rồi đặt mật khẩu mới. Nếu không thấy OTP, hãy kiểm tra mục spam hoặc thử gửi lại sau ít phút.";
        }
        if (normalizedQuestion.contains("dang ky")) {
            return "Để đăng ký, bạn chọn Đăng ký, nhập họ tên, email, số điện thoại và mật khẩu. ViVuGo sẽ gửi OTP về email; nhập OTP để hoàn tất tạo tài khoản.";
        }
        return "Để đăng nhập, bạn dùng email hoặc số điện thoại cùng mật khẩu đã đăng ký. Nếu quên mật khẩu, chọn Quên mật khẩu để nhận OTP qua email và tạo mật khẩu mới.";
    }

    private String answerBookingGuide() {
        return "Cách đặt tour trên ViVuGo:\n1. Mở tour bạn muốn đi và chọn ngày khởi hành.\n2. Chọn số người lớn/trẻ em, kiểm tra tổng tiền.\n3. Bấm Đặt tour, điền thông tin người đặt và người tham gia.\n4. Xác nhận booking và thực hiện thanh toán.\n5. Sau khi thanh toán thành công, bạn có thể theo dõi trạng thái trong lịch sử đặt tour.";
    }

    private String answerTravelTips(String normalizedQuestion) {
        if (normalizedQuestion.contains("bien") || normalizedQuestion.contains("dao")) {
            return "Nếu đi tour biển/đảo, bạn nên chuẩn bị giấy tờ tùy thân, kem chống nắng, đồ bơi, dép dễ đi, túi chống nước, thuốc say tàu xe và sạc dự phòng. Nên có mặt sớm ở điểm hẹn để tránh lỡ lịch trình.";
        }
        if (normalizedQuestion.contains("nui") || normalizedQuestion.contains("sapa") || normalizedQuestion.contains("ha giang")) {
            return "Nếu đi tour vùng núi, bạn nên mang giày bám tốt, áo khoác, thuốc cá nhân, giấy tờ tùy thân, nước uống và một ít đồ ăn nhẹ. Buổi tối có thể lạnh nên đừng chỉ mang đồ mỏng.";
        }
        return "Một số lưu ý khi đi tour: mang giấy tờ tùy thân, thuốc cá nhân, trang phục hợp thời tiết, sạc dự phòng, tiền mặt nhỏ và có mặt tại điểm hẹn sớm 15 phút. Nếu có trẻ em/người lớn tuổi, nên báo trước để được hỗ trợ tốt hơn.";
    }

    private String answerPolicy(String normalizedQuestion) {
        if (normalizedQuestion.contains("thanh toan")) {
            return "Sau khi tạo booking, bạn thực hiện thanh toán theo hướng dẫn trên màn hình. Booking chỉ được xem là xác nhận khi hệ thống ghi nhận giao dịch thành công.";
        }
        if (normalizedQuestion.contains("huy") || normalizedQuestion.contains("hoan tien")) {
            return "Việc hủy hoặc hoàn tiền phụ thuộc trạng thái booking và điều kiện từng tour. Bạn có thể vào lịch sử đặt tour để gửi yêu cầu hủy; admin sẽ kiểm tra và xử lý theo chính sách hiện hành.";
        }
        return "Chính sách giá, trẻ em, hủy/hoàn tiền có thể khác nhau theo từng tour. Bạn nên xem phần chính sách trong trang chi tiết tour hoặc gửi mã booking để ViVuGo kiểm tra chính xác.";
    }

    private List<Map<String, Object>> toDisplayData(List<Tour> tours) {
        return tours.stream().map(tour -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", tour.getTourID());
            map.put("tourID", tour.getTourID());
            map.put("type", "tour");
            map.put("title", tour.getTitle());
            map.put("imageURL", tour.getImageURL());
            map.put("price", tour.getPriceAdult());
            map.put("finalPrice", tour.getPriceAdult());
            return map;
        }).toList();
    }

    private Map<String, Object> summaryToMap(com.vivugo.backend.dto.TourSummaryResponse tour) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", tour.getTourID());
        map.put("tourID", tour.getTourID());
        map.put("type", "tour");
        map.put("title", tour.getTitle());
        map.put("imageURL", tour.getImageURL());
        map.put("price", tour.getPriceAdult());
        map.put("finalPrice", tour.getFinalPrice());
        return map;
    }

    private String tourText(Tour tour) {
        return normalize(String.join(" ",
                safe(tour.getTitle()),
                safe(tour.getDescription()),
                safe(tour.getDeparturePlace()),
                tour.getTourType() == null ? "" : safe(tour.getTourType().getNameType()),
                tour.getTourDestinations() == null ? "" : tour.getTourDestinations().stream()
                        .map(TourDestination::getDestination)
                        .filter(Objects::nonNull)
                        .map(this::destinationText)
                        .collect(java.util.stream.Collectors.joining(" "))
        ));
    }

    private String destinationText(Destination destination) {
        return String.join(" ", safe(destination.getNameDes()), safe(destination.getLocation()), safe(destination.getRegion()));
    }

    private String tourLine(Tour tour) {
        return tour.getTitle() + " - " + formatMoney(tour.getPriceAdult()) + " - " + destinationText(tour);
    }

    private String destinationText(Tour tour) {
        if (tour.getTourDestinations() == null) {
            return "";
        }
        return tour.getTourDestinations().stream()
                .map(TourDestination::getDestination)
                .filter(Objects::nonNull)
                .map(Destination::getNameDes)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse("");
    }

    private String buildBaseInstruction() {
        return """
                Bạn là ViVuGo AI, trợ lý tư vấn du lịch của website ViVuGo.
                Luôn trả lời bằng tiếng Việt có dấu, tự nhiên, đúng câu hỏi và không dùng câu trả lời mẫu lặp lại.
                Dựa trên dữ liệu tour/backend đã cung cấp. Nếu thiếu dữ liệu, nói rõ và hỏi thêm thông tin.
                Không cam kết còn chỗ, hoàn tiền hoặc thanh toán thành công nếu backend chưa xác nhận.
                Câu trả lời nên ngắn gọn nhưng đủ ý, ưu tiên hành động tiếp theo cho khách.
                """;
    }

    private boolean containsAny(String text, String... needles) {
        for (String needle : needles) {
            if (text.contains(needle)) {
                return true;
            }
        }
        return false;
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD);
        return DIACRITICS.matcher(normalized)
                .replaceAll("")
                .replace("đ", "d")
                .replace("Đ", "D")
                .toLowerCase(Locale.ROOT)
                .trim();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private int safeRanking(Tour tour) {
        return tour.getRanking() == null ? 9999 : tour.getRanking();
    }

    private boolean isCustomerVisibleTour(Tour tour) {
        String title = normalize(tour.getTitle());
        return !title.contains("test") && !title.contains("[test]");
    }

    private String formatMoney(Double value) {
        if (value == null) {
            return "liên hệ";
        }
        return String.format(Locale.forLanguageTag("vi-VN"), "%,.0fđ", value);
    }

    private record SearchCriteria(String region, String location, Double maxBudget, String rawQuestion) {
        String humanCondition() {
            List<String> parts = new ArrayList<>();
            if (region != null) parts.add(displayRegion(region));
            if (location != null) parts.add(displayLocation(location));
            if (maxBudget != null) parts.add("giá khoảng/dưới " + String.format(Locale.forLanguageTag("vi-VN"), "%,.0fđ", maxBudget));
            if (parts.isEmpty()) return "yêu cầu bạn đưa ra";
            return String.join(", ", parts);
        }

        String describeForPrompt() {
            return "region=" + region + ", location=" + location + ", maxBudget=" + maxBudget + ", rawQuestion=" + rawQuestion;
        }

        private String displayRegion(String region) {
            return switch (region) {
                case "mien nam" -> "miền Nam";
                case "mien trung" -> "miền Trung";
                case "mien bac" -> "miền Bắc";
                default -> region;
            };
        }

        private String displayLocation(String location) {
            Map<String, String> names = Map.ofEntries(
                    Map.entry("da lat", "Đà Lạt"),
                    Map.entry("nha trang", "Nha Trang"),
                    Map.entry("da nang", "Đà Nẵng"),
                    Map.entry("phu quoc", "Phú Quốc"),
                    Map.entry("sapa", "Sa Pa"),
                    Map.entry("sa pa", "Sa Pa"),
                    Map.entry("ha long", "Hạ Long"),
                    Map.entry("ha noi", "Hà Nội"),
                    Map.entry("hoi an", "Hội An"),
                    Map.entry("hue", "Huế"),
                    Map.entry("vung tau", "Vũng Tàu"),
                    Map.entry("ninh binh", "Ninh Bình"),
                    Map.entry("can tho", "Cần Thơ"),
                    Map.entry("ho chi minh", "TP. Hồ Chí Minh"),
                    Map.entry("hcm", "TP. Hồ Chí Minh")
            );
            return names.getOrDefault(location, location);
        }
    }

    private record TourSearchResult(boolean exactMatch, String reason, List<Tour> tours) {
    }
}

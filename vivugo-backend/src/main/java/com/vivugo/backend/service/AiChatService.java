package com.vivugo.backend.service;

import com.vivugo.backend.dto.ChatMessage;
import com.vivugo.backend.dto.ChatResponse;
import com.vivugo.backend.model.Tour;
import com.vivugo.backend.repository.TourRepository;
// TODO: Import các Repository khác khi bạn phát triển thêm
// import com.vivugo.backend.model.Hotel;
// import com.vivugo.backend.repository.HotelRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiChatService {

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.model}")
    private String aiModel;

    private final String apiUrl = "https://openrouter.ai/api/v1/chat/completions";
    private final RestTemplate restTemplate;

    @Autowired
    private TourRepository tourRepository;

    // @Autowired
    // private HotelRepository hotelRepository;

    public AiChatService() {
        // Nới lỏng thời gian chờ tránh timeout
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(25000);
        this.restTemplate = new RestTemplate(factory);
    }

    public ChatResponse getChatResponse(List<ChatMessage> messages) {
        String userQuestion = messages.get(messages.size() - 1).getContent().toLowerCase();

        // 1. Phân loại ý định (Intent) và trích xuất từ khóa (Location)
        String intent = detectIntent(userQuestion);
        String keyword = extractLocation(userQuestion);

        // 2. Chuẩn bị dữ liệu hiển thị (UI Data) và Chỉ thị hệ thống (System Instruction)
        List<Map<String, Object>> displayData = new ArrayList<>();
        String systemInstruction = "Bạn là ViVuGo, trợ lý ảo du lịch thông minh, thân thiện của website. ";

        switch (intent) {
            case "TOUR_SEARCH":
                displayData = handleTourSearch(keyword);
                systemInstruction += "Người dùng đang muốn tìm Tour du lịch. Hệ thống ĐÃ HIỂN THỊ CÁC THẺ TOUR DƯỚI GIAO DIỆN. "
                        + "TUYỆT ĐỐI KHÔNG liệt kê chi tiết tên, giá, hay lịch trình ra văn bản. "
                        + "Chỉ nói một câu giới thiệu ngắn gọn mời khách tham khảo các tour bên dưới.";
                break;

            case "HOTEL_SEARCH":
                // TODO: Bỏ comment khi có HotelRepository
                // displayData = handleHotelSearch(keyword);
                systemInstruction += "Người dùng đang muốn tìm Phòng Khách Sạn. Hệ thống ĐÃ HIỂN THỊ THẺ KHÁCH SẠN DƯỚI GIAO DIỆN. "
                        + "TUYỆT ĐỐI KHÔNG liệt kê chi tiết tên khách sạn hay giá phòng ra văn bản. "
                        + "Chỉ nói một câu ngắn gọn mời khách xem danh sách phòng gợi ý bên dưới.";
                break;

            case "FAQ_POLICY":
                // Bạn có thể query DB để lấy chính sách cụ thể, ở đây demo fix cứng
                String companyPolicy = "Website cung cấp tour toàn quốc. Hủy trước 7 ngày miễn phí. Trẻ em dưới 5 tuổi miễn phí 100%. Thanh toán qua thẻ tín dụng, Momo hoặc VNPay.";
                systemInstruction += "Người dùng đang hỏi thông tin tư vấn chung hoặc chính sách. "
                        + "Hãy dùng thông tin sau để trả lời: [" + companyPolicy + "]. "
                        + "Trả lời ngắn gọn, súc tích, chuyên nghiệp và tuyệt đối không bịa đặt thông tin ngoài chính sách này.";
                break;

            default:
                systemInstruction += "Hãy trò chuyện tự nhiên. Nếu khách chưa nói rõ muốn đi đâu hoặc cần dịch vụ gì (Tour, Khách sạn, Thuê xe...), "
                        + "hãy lịch sự đặt câu hỏi gợi mở để hỗ trợ họ tốt nhất.";
                break;
        }

        // 3. Giao tiếp với OpenRouter AI
        String aiReply = callOpenRouter(messages, systemInstruction);

        // 4. Trả về Frontend (Bạn có thể thêm biến 'intent' vào DTO ChatResponse nếu muốn Frontend đổi UI theo Intent)
        return new ChatResponse(aiReply, displayData);
    }

    // =========================================================================
    // CÁC HÀM HỖ TRỢ (HELPER METHODS)
    // =========================================================================

    private String detectIntent(String text) {
        if (text.contains("khách sạn") || text.contains("phòng") || text.contains("hotel") || text.contains("homestay") || text.contains("resort")) {
            return "HOTEL_SEARCH";
        }
        if (text.contains("hủy") || text.contains("thanh toán") || text.contains("giá") || text.contains("trẻ em") || text.contains("chính sách")) {
            return "FAQ_POLICY";
        }
        if (text.contains("tour") || text.contains("đi chơi") || text.contains("du lịch") || extractLocation(text).length() > 0) {
            return "TOUR_SEARCH";
        }
        return "GENERAL_CHAT";
    }

    private String extractLocation(String text) {
        // Cải tiến bằng mảng linh hoạt hơn
        String[] locations = {"đà lạt", "nha trang", "đà nẵng", "phú quốc", "sapa", "hạ long", "hà nội", "hội an", "huế", "vũng tàu", "ninh bình", "mai châu", "mộc châu", "cần thơ", "sài gòn", "hcm", "hồ chí minh"};
        for (String loc : locations) {
            if (text.contains(loc)) {
                return loc;
            }
        }
        return "";
    }

    private List<Map<String, Object>> handleTourSearch(String keyword) {
        List<Tour> tours = new ArrayList<>();
        if (!keyword.isEmpty()) {
            tours = tourRepository.findByTitleContainingIgnoreCase(keyword);
        }

        // Fallback: Nếu không tìm thấy, lấy 4 tour gợi ý
        if (tours.isEmpty()) {
            tours = tourRepository.findAll();
            if (tours.size() > 4) tours = tours.subList(0, 4);
        }

        // Parse an toàn sang Map
        List<Map<String, Object>> safeData = new ArrayList<>();
        for (Tour t : tours) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", t.getTourID()); // Đổi tên key thống nhất (id) cho cả Tour/Hotel dễ render ở UI
            map.put("type", "tour"); // Gắn cờ type để frontend phân biệt hiển thị card
            map.put("title", t.getTitle());
            map.put("imageURL", t.getImageURL());
            map.put("price", t.getPriceAdult());
            safeData.add(map);
        }
        return safeData;
    }

    // TODO: Bỏ comment và điều chỉnh khi code chức năng Hotel
    /*
    private List<Map<String, Object>> handleHotelSearch(String keyword) {
        List<Hotel> hotels = new ArrayList<>();
        if (!keyword.isEmpty()) {
            hotels = hotelRepository.findByLocationContainingIgnoreCase(keyword);
        }
        List<Map<String, Object>> safeData = new ArrayList<>();
        for (Hotel h : hotels) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", h.getId());
            map.put("type", "hotel");
            map.put("title", h.getName());
            map.put("imageURL", h.getImage());
            map.put("price", h.getPricePerNight());
            safeData.add(map);
        }
        return safeData;
    }
    */

    private String callOpenRouter(List<ChatMessage> messages, String systemInstruction) {
        String aiReply = "Xin lỗi, hiện tại mình đang bận. Bạn vui lòng thử lại sau nhé!";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // Xây dựng lịch sử chat gửi lên AI
            List<Map<String, String>> finalMessages = new ArrayList<>();

            // 1. Gửi System Prompt trước tiên để set luật
            Map<String, String> sysMsg = new HashMap<>();
            sysMsg.put("role", "system");
            sysMsg.put("content", systemInstruction);
            finalMessages.add(sysMsg);

            // 2. Add toàn bộ lịch sử trò chuyện
            for (ChatMessage msg : messages) {
                Map<String, String> m = new HashMap<>();
                m.put("role", msg.getRole());
                m.put("content", msg.getContent());
                finalMessages.add(m);
            }

            Map<String, Object> body = new HashMap<>();
            body.put("model", aiModel);
            body.put("messages", finalMessages);
            body.put("temperature", 0.3); // Giảm temp xuống một chút để AI bớt bịa chuyện, bám sát policy hơn

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

            if (response.getBody() != null && response.getBody().containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> msg = (Map<String, Object>) choices.get(0).get("message");
                    aiReply = (String) msg.get("content");
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi gọi OpenRouter AI: " + e.getMessage());
        }
        return aiReply;
    }
}

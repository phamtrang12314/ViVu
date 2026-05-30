package com.vivugo.backend.admin.service;

import com.vivugo.backend.model.Destination;
import com.vivugo.backend.repository.DestinationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@Order(100)
public class DestinationCatalogSeeder implements CommandLineRunner {

    private final DestinationRepository destinationRepository;

    public DestinationCatalogSeeder(DestinationRepository destinationRepository) {
        this.destinationRepository = destinationRepository;
    }

    @Override
    public void run(String... args) {
        Map<String, String> provinceRegionMap = buildProvinceRegionMap();
        Set<String> existingNames = destinationRepository.findAll().stream()
                .map(Destination::getNameDes)
                .filter(name -> name != null && !name.isBlank())
                .map(name -> normalize(name))
                .collect(Collectors.toSet());

        int created = 0;
        int sequence = destinationRepository.findAll().size() + 1;

        for (Map.Entry<String, String> entry : provinceRegionMap.entrySet()) {
            String province = entry.getKey();
            String region = entry.getValue();
            if (existingNames.contains(normalize(province))) {
                continue;
            }

            Destination destination = new Destination();
            destination.setDestinationID(String.format("dest-vn-%03d", sequence++));
            destination.setNameDes(province);
            destination.setLocation(province);
            destination.setCountry("Việt Nam");
            destination.setRegion(region);
            destinationRepository.save(destination);
            created++;
        }

        if (created > 0) {
            System.out.printf("[DestinationCatalogSeeder] Added %d missing destinations%n", created);
        }
    }

    private String normalize(String value) {
        return value.trim().toLowerCase(Locale.ROOT);
    }

    private Map<String, String> buildProvinceRegionMap() {
        Map<String, String> map = new LinkedHashMap<>();

        add(map, "Miền Bắc",
                "Hà Nội", "Hà Giang", "Cao Bằng", "Bắc Kạn", "Tuyên Quang",
                "Lào Cai", "Điện Biên", "Lai Châu", "Sơn La", "Yên Bái",
                "Hòa Bình", "Thái Nguyên", "Lạng Sơn", "Quảng Ninh", "Bắc Giang",
                "Phú Thọ", "Vĩnh Phúc", "Bắc Ninh", "Hải Dương", "Hải Phòng",
                "Hưng Yên", "Thái Bình", "Nam Định", "Hà Nam", "Ninh Bình");

        add(map, "Miền Trung",
                "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình", "Quảng Trị",
                "Thừa Thiên Huế", "Đà Nẵng", "Quảng Nam", "Quảng Ngãi", "Bình Định",
                "Phú Yên", "Khánh Hòa", "Ninh Thuận", "Bình Thuận",
                "Kon Tum", "Gia Lai", "Đắk Lắk", "Đắk Nông", "Lâm Đồng");

        add(map, "Miền Nam",
                "Bình Phước", "Tây Ninh", "Bình Dương", "Đồng Nai", "Bà Rịa - Vũng Tàu",
                "TP. Hồ Chí Minh", "Long An", "Tiền Giang", "Bến Tre", "Trà Vinh",
                "Vĩnh Long", "Đồng Tháp", "An Giang", "Kiên Giang", "Cần Thơ",
                "Hậu Giang", "Sóc Trăng", "Bạc Liêu", "Cà Mau");

        return map;
    }

    private void add(Map<String, String> map, String region, String... provinces) {
        for (String province : provinces) {
            map.put(province, region);
        }
    }
}

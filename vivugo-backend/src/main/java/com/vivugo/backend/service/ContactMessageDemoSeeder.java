package com.vivugo.backend.service;

import com.vivugo.backend.model.ContactMessage;
import com.vivugo.backend.model.SupportConversation;
import com.vivugo.backend.model.SupportMessage;
import com.vivugo.backend.model.User;
import com.vivugo.backend.model.enums.SupportMessageSenderType;
import com.vivugo.backend.repository.ContactMessageRepository;
import com.vivugo.backend.repository.SupportConversationRepository;
import com.vivugo.backend.repository.SupportMessageRepository;
import com.vivugo.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(140)
public class ContactMessageDemoSeeder implements CommandLineRunner {

    private static final int TARGET_MESSAGE_COUNT = 40;

    private final ContactMessageRepository contactMessageRepository;
    private final SupportConversationRepository supportConversationRepository;
    private final SupportMessageRepository supportMessageRepository;
    private final UserRepository userRepository;

    public ContactMessageDemoSeeder(
            ContactMessageRepository contactMessageRepository,
            SupportConversationRepository supportConversationRepository,
            SupportMessageRepository supportMessageRepository,
            UserRepository userRepository
    ) {
        this.contactMessageRepository = contactMessageRepository;
        this.supportConversationRepository = supportConversationRepository;
        this.supportMessageRepository = supportMessageRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        seedIfNeeded();
    }

    public synchronized void seedIfNeeded() {
        long currentCount = contactMessageRepository.count();
        if (currentCount >= TARGET_MESSAGE_COUNT) {
            return;
        }

        int toCreate = (int) (TARGET_MESSAGE_COUNT - currentCount);
        List<User> users = userRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        String[] names = {
                "Nguyen Van An", "Tran Minh Khoa", "Le Thi Mai", "Pham Thu Ha", "Vo Minh Duc",
                "Bui Van Lam", "Hoang Gia Bao", "Dang Ngoc Anh", "Trinh Khai", "Do Quynh Nhu"
        };

        String[] subjects = {
                "Tu van lich trinh", "Hoi gia tour", "Yeu cau doi ngay", "Can xuat hoa don VAT",
                "Hoi ve khuyen mai", "Can ho tro thanh toan", "Hoi dich vu dua don",
                "Can tu van tour gia dinh", "Hoi dieu kien hoan huy", "Gop y dich vu"
        };

        String[] templates = {
                "Cho minh hoi tour %s con cho trong thang nay khong?",
                "Minh muon dat tour %s cho nhom 6 nguoi, co uu dai nao khong?",
                "Tour %s co bao gom dua don tai san bay khong?",
                "Minh can doi lich tour %s sang tuan sau, ad ho tro giup.",
                "Tour %s co lich trinh cho tre em 7 tuoi di cung khong?",
                "Cho minh xin thong tin thanh toan tour %s va xac nhan nhanh.",
                "Minh can admin goi lai tu van them ve tour %s.",
                "Cho hoi tour %s co hoa don va hop dong cho cong ty khong?",
                "Minh vua gui booking tour %s, nho admin xac nhan giup.",
                "Cho minh xin danh sach vat dung can chuan bi cho tour %s."
        };

        String[] tourCodes = {
                "tour-001", "tour-002", "tour-003", "tour-004", "tour-005",
                "tour-006", "tour-007", "tour-008", "tour-009", "tour-010"
        };

        for (int i = 0; i < toCreate; i++) {
            int seedIndex = (int) currentCount + i;
            String name = names[seedIndex % names.length];
            String subject = subjects[seedIndex % subjects.length];
            String tourCode = tourCodes[seedIndex % tourCodes.length];
            String messageText = String.format(templates[seedIndex % templates.length], tourCode);
            String email = "khach" + (seedIndex + 1) + "@example.com";
            String phone = String.format("09%08d", 10000000 + seedIndex);
            boolean replied = seedIndex % 3 == 0;

            User linkedUser = users.isEmpty() ? null : users.get(seedIndex % users.size());

            SupportConversation conversation = new SupportConversation();
            conversation.setCustomerName(name);
            conversation.setCustomerEmail(email);
            conversation.setCustomerPhone(phone);
            conversation.setUser(linkedUser);
            conversation.setLastMessageAt(now.minusHours(seedIndex + 1L));
            conversation.setLastMessagePreview(messageText);
            conversation.setReplied(replied);
            conversation = supportConversationRepository.save(conversation);

            SupportMessage customerMessage = new SupportMessage();
            customerMessage.setConversation(conversation);
            customerMessage.setSenderType(SupportMessageSenderType.CUSTOMER);
            customerMessage.setSenderName(name);
            customerMessage.setContent(messageText);
            supportMessageRepository.save(customerMessage);

            if (replied) {
                String adminReply = "Cam on ban da lien he ViVuGo. Admin da tiep nhan va se ho tro ngay.";

                SupportMessage adminMessage = new SupportMessage();
                adminMessage.setConversation(conversation);
                adminMessage.setSenderType(SupportMessageSenderType.ADMIN);
                adminMessage.setSenderName("Admin ViVuGo");
                adminMessage.setContent(adminReply);
                supportMessageRepository.save(adminMessage);

                conversation.setLastMessagePreview(adminReply);
                conversation.setLastMessageAt(now.minusHours(seedIndex).plusMinutes(15));
                conversation.setReplied(true);
                supportConversationRepository.save(conversation);
            }

            ContactMessage contactMessage = new ContactMessage();
            contactMessage.setName(name);
            contactMessage.setEmail(email);
            contactMessage.setPhone(phone);
            contactMessage.setSubject(subject);
            contactMessage.setMessage(messageText);
            contactMessage.setUser(linkedUser);
            contactMessage.setConversation(conversation);
            contactMessage.setResponded(replied);
            if (replied) {
                contactMessage.setRespondedBy("Admin ViVuGo");
                contactMessage.setRespondedAt(now.minusHours(seedIndex).plusMinutes(20));
            }
            contactMessageRepository.save(contactMessage);
        }

        System.out.printf("[ContactMessageDemoSeeder] Added %d demo contact messages%n", toCreate);
    }
}

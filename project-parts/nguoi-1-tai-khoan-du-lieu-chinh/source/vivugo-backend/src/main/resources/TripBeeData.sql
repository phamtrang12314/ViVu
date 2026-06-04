-- -- -- CREATE DATABASE "VivuGoDB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';

-- XÃ“A Dá»® LIá»†U CÅ¨ TRÆ¯á»šC KHI THÃŠM Dá»® LIá»†U Má»šI (ÄÃšNG THá»¨ Tá»°)
DELETE FROM payments;
DELETE FROM invoices;
DELETE FROM participants;
DELETE FROM bookings;
DELETE FROM reviews;
DELETE FROM favorites;
DELETE FROM contact_messages;
DELETE FROM tour_promotions;
DELETE FROM tour_destinations;
DELETE FROM itineraries;
DELETE FROM tour_images;
DELETE FROM images;
DELETE FROM accounts;
DELETE FROM admins;
DELETE FROM customers;
DELETE FROM tours;
DELETE FROM promotions;
DELETE FROM destinations;
DELETE FROM tour_types;

-- =================================================================
-- 1. Báº¢NG Äá»˜C Láº¬P
-- =================================================================

-- TourTypes (5 loáº¡i)
INSERT INTO tour_types (tour_typeid, name_type, "description", created_at, update_date) VALUES
('type-01', 'Tour Biển', 'Các tour du lịch đến bãi biển và đảo.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('type-02', 'Tour Núi', 'Khám phá và leo núi, trekking.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('type-03', 'Tour Văn Hóa', 'Tham quan di tích lịch sử, làng nghề.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('type-04', 'Tour Ẩm Thực', 'Trải nghiệm đặc sản địa phương.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('type-05', 'Tour Mạo Hiểm', 'Các hoạt động như nhảy dù, lặn biển.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Destinations (30 Ä‘iá»ƒm Ä‘áº¿n, cÃ³ cá»™t 'region')
INSERT INTO destinations (destinationid, name_des, location, country, region) VALUES
-- Miá»n Báº¯c (10)
('dest-mb-01', 'Hà Nội', 'Hà Nội', 'Việt Nam', 'Miền Bắc'),
('dest-mb-02', 'Vịnh Hạ Long', 'Quảng Ninh', 'Việt Nam', 'Miền Bắc'),
('dest-mb-03', 'Sa Pa', 'Lào Cai', 'Việt Nam', 'Miền Bắc'),
('dest-mb-04', 'Ninh Bình', 'Ninh Bình', 'Việt Nam', 'Miền Bắc'),
('dest-mb-05', 'Mộc Châu', 'Sơn La', 'Việt Nam', 'Miền Bắc'),
('dest-mb-06', 'Hà Giang', 'Hà Giang', 'Việt Nam', 'Miền Bắc'),
('dest-mb-07', 'Cát Bà', 'Hải Phòng', 'Việt Nam', 'Miền Bắc'),
('dest-mb-08', 'Mai Châu', 'Hòa Bình', 'Việt Nam', 'Miền Bắc'),
('dest-mb-09', 'Yên Tử', 'Quảng Ninh', 'Việt Nam', 'Miền Bắc'),
('dest-mb-10', 'Ba Vì', 'Hà Nội', 'Việt Nam', 'Miền Bắc'),
-- Miá»n Trung (10)
('dest-mt-01', 'Huế', 'Thừa Thiên Huế', 'Việt Nam', 'Miền Trung'),
('dest-mt-02', 'Đà Nẵng', 'Đà Nẵng', 'Việt Nam', 'Miền Trung'),
('dest-mt-03', 'Hội An', 'Quảng Nam', 'Việt Nam', 'Miền Trung'),
('dest-mt-04', 'Phú Yên', 'Phú Yên', 'Việt Nam', 'Miền Trung'),
('dest-mt-05', 'Nha Trang', 'Khánh Hòa', 'Việt Nam', 'Miền Trung'),
('dest-mt-06', 'Đà Lạt', 'Lâm Đồng', 'Việt Nam', 'Miền Trung'),
('dest-mt-07', 'Quảng Bình', 'Quảng Bình', 'Việt Nam', 'Miền Trung'),
('dest-mt-08', 'Bình Định', 'Bình Định', 'Việt Nam', 'Miền Trung'),
('dest-mt-09', 'Nghệ An', 'Nghệ An', 'Việt Nam', 'Miền Trung'),
('dest-mt-10', 'Quảng Trị', 'Quảng Trị', 'Việt Nam', 'Miền Trung'),
-- Miá»n Nam (10)
('dest-mn-01', 'TP. Hồ Chí Minh', 'TP. Hồ Chí Minh', 'Việt Nam', 'Miền Nam'),
('dest-mn-02', 'Phú Quốc', 'Kiên Giang', 'Việt Nam', 'Miền Nam'),
('dest-mn-03', 'Cần Thơ', 'Cần Thơ', 'Việt Nam', 'Miền Nam'),
('dest-mn-04', 'Bến Tre', 'Bến Tre', 'Việt Nam', 'Miền Nam'),
('dest-mn-05', 'Vũng Tàu', 'Bà Rịa – Vũng Tàu', 'Việt Nam', 'Miền Nam'),
('dest-mn-06', 'Đồng Tháp', 'Đồng Tháp', 'Việt Nam', 'Miền Nam'),
('dest-mn-07', 'An Giang', 'An Giang', 'Việt Nam', 'Miền Nam'),
('dest-mn-08', 'Tây Ninh', 'Tây Ninh', 'Việt Nam', 'Miền Nam'),
('dest-mn-09', 'Cà Mau', 'Cà Mau', 'Việt Nam', 'Miền Nam'),
('dest-mn-10', 'Bạc Liêu', 'Bạc Liêu', 'Việt Nam', 'Miền Nam');

-- Promotions (30 khuyáº¿n mÃ£i)
INSERT INTO promotions (promotionid, title, "description", discount_percentage, discount_amount, limit_usage, current_usage, start_date, end_date, status, created_at, update_date) VALUES
('promo-001', 'SALEHE', 'Giảm 10% hè rực rỡ', 10, 0, 100, 0, '2025-06-01', '2025-08-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-002', 'CHAOBAN', 'Giảm 150k cho khách mới', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-003', 'GIAM15', 'Giảm 15% tour núi', 15, 0, 50, 0, '2025-09-01', '2025-11-30', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-004', 'GIAM10', 'Giảm 10% tour văn hóa', 10, 0, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-005', 'DEALNGON', 'Giảm 200k', 0, 200000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-006', 'FLASH10', 'Flash Sale 10%', 10, 0, 20, 0, '2025-11-11', '2025-11-12', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-007', 'GIAM5', 'Giảm 5% tour biển', 5, 0, 200, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-008', 'GIAM7', 'Giảm 7% tour mạo hiểm', 7, 0, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-009', 'GIAM300K', 'Giảm 300.000 VNĐ', 0, 300000, 50, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-010', 'GIAM12', 'Giảm 12% tour lễ hội', 12, 0, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-011', 'SALE10A', 'Giảm 10% đặc biệt A', 10, 0, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-012', 'SALE10B', 'Giảm 10% đặc biệt B', 10, 0, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-013', 'SALE10C', 'Giảm 10% đặc biệt C', 10, 0, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-014', 'SALE10D', 'Giảm 10% đặc biệt D', 10, 0, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-015', 'SALE10E', 'Giảm 10% đặc biệt E', 10, 0, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-016', 'GIAM200K_A', 'Giảm 200k A', 0, 200000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-017', 'GIAM200K_B', 'Giảm 200k B', 0, 200000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-018', 'GIAM200K_C', 'Giảm 200k C', 0, 200000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-019', 'GIAM200K_D', 'Giảm 200k D', 0, 200000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-020', 'GIAM200K_E', 'Giảm 200k E', 0, 200000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-021', 'GIAM150K_A', 'Giảm 150k A', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-022', 'GIAM150K_B', 'Giảm 150k B', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-023', 'GIAM150K_C', 'Giảm 150k C', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-024', 'GIAM150K_D', 'Giảm 150k D', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-025', 'GIAM150K_E', 'Giảm 150k E', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-026', 'GIAM150K_F', 'Giảm 150k F', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-027', 'GIAM150K_G', 'Giảm 150k G', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-028', 'GIAM150K_H', 'Giảm 150k H', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-029', 'GIAM150K_I', 'Giảm 150k I', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('promo-030', 'GIAM150K_K', 'Giảm 150k K', 0, 150000, 100, 0, '2025-01-01', '2025-12-31', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- =================================================================
-- 2. Báº¢NG USER VÃ€ ACCOUNT (31 users)
-- =================================================================

-- Users (1 Admin, 30 Customers)
INSERT INTO admins (adminid, name, phone_number, email, password, role, locked, created_at, updated_at) VALUES
('admin-001', 'Admin VivuGo', '0123456789', 'admin@vivugo.com', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'ADMIN', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('admin-002', 'Quản lý Tour', '0123456790', 'touradmin@vivugo.com', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'ADMIN', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('admin-003', 'Quản lý Booking', '0123456791', 'bookingadmin@vivugo.com', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'ADMIN', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO customers (userid, name, email, phone_number, address, avatarurl, created_at) VALUES
('user-admin', 'Admin VivuGo', 'admin@vivugo.com', '0123456789', '123 Admin St, HCMC', '/images/avatars/admin.png', '2025-05-01 10:30:00'),
('user-cust-001', 'Nguyễn Văn An', 'nguyenvanan@gmail.com', '0987654321', '456 Lê Lợi, Hà Nội', '/images/avatars/avatar1.png', '2025-05-02 11:00:00'),
('user-cust-002', 'Trần Thị Bình', 'tranbinh@gmail.com', '0912345678', '789 Nguyễn Huệ, Đà Nẵng', '/images/avatars/avatar2.png', '2025-06-01 14:00:00'),
('user-cust-003', 'Lê Minh Cường', 'lecuong@outlook.com', '0905111222', '321 Hùng Vương, Cần Thơ', '/images/avatars/avatar3.png', '2025-06-02 15:00:00'),
('user-cust-004', 'Phạm Hồng Duyên', 'phamduyen@yahoo.com', '0978999888', '654 Hai Bà Trưng, Huế', '/images/avatars/avatar4.png', '2025-10-01 09:00:00'),
('user-cust-005', 'Võ Thanh E', 'vothanhe@gmail.com', '0905111333', '111 Phan Chu Trinh, Vũng Tàu', '/images/avatars/avatar1.png', '2025-10-02 10:00:00'),
('user-cust-006', 'Đặng Kim G', 'danggkim@gmail.com', '0905111444', '222 Trần Hưng Đạo, TP.HCM', '/images/avatars/avatar2.png', '2025-05-10 12:00:00'),
('user-cust-007', 'Hoàng Văn H', 'hoangvanh@gmail.com', '0905111555', '333 Nguyễn Văn Cừ, Hà Nội', '/images/avatars/avatar3.png', '2025-05-11 13:00:00'),
('user-cust-008', 'Trịnh Thị I', 'trinhthii@gmail.com', '0905111666', '444 Lê Duẩn, Đà Nẵng', '/images/avatars/avatar4.png', '2025-11-20 16:00:00'),
('user-cust-009', 'Lý Minh K', 'lyminhk@gmail.com', '0905111777', '555 Võ Thị Sáu, TP.HCM', '/images/avatars/avatar1.png', '2025-11-21 17:00:00'),
('user-cust-010', 'Bùi Văn L', 'buivanl@gmail.com', '0905111888', '666 Pasteur, TP.HCM', '/images/avatars/avatar2.png', '2025-11-01 18:00:00'),
('user-cust-011', 'Ngô Thị M', 'ngothim@gmail.com', '0905111999', '777 Lý Thường Kiệt, Hà Nội', '/images/avatars/avatar3.png', '2025-11-02 19:00:00'),
('user-cust-012', 'Dương Văn N', 'duongvann@gmail.com', '0905222111', '888 Hoàng Diệu, Đà Nẵng', '/images/avatars/avatar4.png', '2025-06-15 14:00:00'),
('user-cust-013', 'Phan Thị O', 'phanthio@gmail.com', '0905222222', '999 Hùng Vương, Huế', '/images/avatars/avatar1.png', '2025-06-16 15:00:00'),
('user-cust-014', 'Mai Văn P', 'maivanp@gmail.com', '0905222333', '121 Lê Lợi, TP.HCM', '/images/avatars/avatar2.png', '2025-05-20 10:00:00'),
('user-cust-015', 'Huỳnh Thị Q', 'huynhthiq@gmail.com', '0905222444', '131 Nguyễn Trãi, Hà Nội', '/images/avatars/avatar3.png', '2025-05-21 11:00:00'),
('user-cust-016', 'Lưu Văn R', 'luuvanr@gmail.com', '0905222555', '141 Trần Phú, Nha Trang', '/images/avatars/avatar4.png', '2025-05-15 10:00:00'),
('user-cust-017', 'Tô Thị S', 'tothis@gmail.com', '0905222666', '151 Quang Trung, TP.HCM', '/images/avatars/avatar1.png', '2025-07-11 15:00:00'),
('user-cust-018', 'Đinh Văn T', 'dinhvant@gmail.com', '0905222777', '161 Hàm Nghi, Đà Nẵng', '/images/avatars/avatar2.png', '2025-06-21 15:00:00'),
('user-cust-019', 'Chu Thị U', 'chothiu@gmail.com', '0905222888', '171 Tôn Đức Thắng, Hà Nội', '/images/avatars/avatar3.png', '2025-06-26 11:00:00'),
('user-cust-020', 'Vương Văn V', 'vuongvanv@gmail.com', '0905222999', '181 Nguyễn Tất Thành, TP.HCM', '/images/avatars/avatar4.png', '2025-09-01 14:00:00'),
('user-cust-021', 'Mạc Thị X', 'macthix@gmail.com', '0905333111', '191 Bà Triệu, Hà Nội', '/images/avatars/avatar1.png', '2025-09-02 15:00:00'),
('user-cust-022', 'Đỗ Văn Y', 'dovany@gmail.com', '0905333222', '202 Hai Bà Trưng, TP.HCM', '/images/avatars/avatar2.png', '2025-07-20 10:00:00'),
('user-cust-023', 'Giang Thị Z', 'giangthiz@gmail.com', '0905333333', '212 Trần Não, TP.HCM', '/images/avatars/avatar3.png', '2025-07-21 11:00:00'),
('user-cust-024', 'Trần Văn A1', 'tranvana1@gmail.com', '0905333444', '223 An Dương Vương, TP.HCM', '/images/avatars/avatar4.png', '2025-07-01 14:00:00'),
('user-cust-025', 'Lê Thị B2', 'lethib2@gmail.com', '0905333555', '234 Điện Biên Phủ, TP.HCM', '/images/avatars/avatar1.png', '2025-07-02 15:00:00'),
('user-cust-026', 'Phạm Văn C3', 'phamvanc3@gmail.com', '0905333666', '245 CMT8, TP.HCM', '/images/avatars/avatar2.png', '2025-05-31 11:00:00'),
('user-cust-027', 'Nguyễn Thị D4', 'nguyenthid4@gmail.com', '0905333777', '256 Nguyễn Thị Minh Khai, TP.HCM', '/images/avatars/avatar3.png', '2025-04-02 11:00:00'),
('user-cust-028', 'Võ Văn E5', 'vovane5@gmail.com', '0905333888', '267 Lý Tự Trọng, TP.HCM', '/images/avatars/avatar4.png', '2025-07-16 15:00:00'),
('user-cust-029', 'Đặng Thị F6', 'dangthif6@gmail.com', '0905333999', '278 Pasteur, TP.HCM', '/images/avatars/avatar1.png', '2025-05-15 10:00:00'),
('user-cust-030', 'Hoàng Văn G7', 'hoangvang7@gmail.com', '0905444111', '289 Nam Kỳ Khởi Nghĩa, TP.HCM', '/images/avatars/avatar2.png', '2025-05-16 11:00:00');

-- Accounts (Máº­t kháº©u: password123, hash: $2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu)
INSERT INTO accounts (accountid, user_name, password, role, create_date, update_date, is_locked, customer_id) VALUES
('acct-admin', 'admin', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-admin'),
('acct-cust-001', 'nguyenvanan', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-001'),
('acct-cust-002', 'tranbinh', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-002'),
('acct-cust-003', 'lecuong', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-003'),
('acct-cust-004', 'phamduyen', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-004'),
('acct-cust-005', 'vothanhe', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-005'),
('acct-cust-006', 'danggkim', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-006'),
('acct-cust-007', 'hoangvanh', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-007'),
('acct-cust-008', 'trinhthii', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-008'),
('acct-cust-009', 'lyminhk', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-009'),
('acct-cust-010', 'buivanl', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-010'),
('acct-cust-011', 'ngothim', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-011'),
('acct-cust-012', 'duongvann', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-012'),
('acct-cust-013', 'phanthio', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-013'),
('acct-cust-014', 'maivanp', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-014'),
('acct-cust-015', 'huynhthiq', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-015'),
('acct-cust-016', 'luuvanr', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-016'),
('acct-cust-017', 'tothis', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-017'),
('acct-cust-018', 'dinhvant', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-018'),
('acct-cust-019', 'chothiu', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-019'),
('acct-cust-020', 'vuongvanv', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-020'),
('acct-cust-021', 'macthix', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-021'),
('acct-cust-022', 'dovany', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-022'),
('acct-cust-023', 'giangthiz', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-023'),
('acct-cust-024', 'tranvana1', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-024'),
('acct-cust-025', 'lethib2', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-025'),
('acct-cust-026', 'phamvanc3', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-026'),
('acct-cust-027', 'nguyenthid4', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-027'),
('acct-cust-028', 'vovane5', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-028'),
('acct-cust-029', 'dangthif6', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-029'),
('acct-cust-030', 'hoangvang7', '$2a$10$YuoRZe4ajac.rtsPwGu0hO9XhSJ9PVqnD8ec45uxfzxMR90FScxeu', 'CUSTOMER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, false, 'user-cust-030');


-- =================================================================
-- 3. Báº¢NG áº¢NH ÄIá»‚M Äáº¾N (Images) - (90 áº£nh)
-- =================================================================

-- 3 áº£nh cho HÃ  Ná»™i (dest-mb-01)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hn-01', '/images/destinations/hanoi_des.jpg', 'Tháp Rùa Hồ Gươm', CURRENT_TIMESTAMP, 'dest-mb-01'),
('img-hn-02', '/images/destinations/hanoi02_des.jpg', 'Hà Nội về đêm', CURRENT_TIMESTAMP, 'dest-mb-01'),
('img-hn-03', '/images/destinations/hanoi03_des.jpg', 'Phố cổ Hà Nội', CURRENT_TIMESTAMP, 'dest-mb-01');
-- 3 áº£nh cho Háº¡ Long (dest-mb-02)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hl-01', '/images/destinations/halong01_des.jpg', 'Vịnh Hạ Long', CURRENT_TIMESTAMP, 'dest-mb-02'),
('img-hl-02', '/images/destinations/halong02_des.jpg', 'Du thuyền Hạ Long', CURRENT_TIMESTAMP, 'dest-mb-02'),
('img-hl-03', '/images/destinations/halong03_des.jpg', 'Toàn cảnh vịnh', CURRENT_TIMESTAMP, 'dest-mb-02');
-- 3 áº£nh cho Sa Pa (dest-mb-03)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-sp-01', '/images/destinations/sapa01_des.webp', 'Đỉnh Fansipan', CURRENT_TIMESTAMP, 'dest-mb-03'),
('img-sp-02', '/images/destinations/sapa02_des.jpg', 'Thị trấn trong sương', CURRENT_TIMESTAMP, 'dest-mb-03'),
('img-sp-03', '/images/destinations/sapa03_des.webp', 'Fansipan có tuyết', CURRENT_TIMESTAMP, 'dest-mb-03');
-- 3 áº£nh cho Ninh BÃ¬nh (dest-mb-04)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-nb-01', '/images/destinations/ninhbinh01_des.jpg', 'Tràng An', CURRENT_TIMESTAMP, 'dest-mb-04'),
('img-nb-02', '/images/destinations/ninhbinh02_des.jpg', 'Tam Cốc Bích Động', CURRENT_TIMESTAMP, 'dest-mb-04'),
('img-nb-03', '/images/destinations/ninhbinh03_des.webp', 'Du thuyền Tràng An', CURRENT_TIMESTAMP, 'dest-mb-04');
-- 3 áº£nh cho Má»™c ChÃ¢u (dest-mb-05)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-mc-01', '/images/destinations/mocchau01_des.webp', 'Đồi chè Mộc Châu', CURRENT_TIMESTAMP, 'dest-mb-05'),
('img-mc-02', '/images/destinations/mocchau02_des.jpg', 'Ruộng bậc thang', CURRENT_TIMESTAMP, 'dest-mb-05'),
('img-mc-03', '/images/destinations/mocchau03_des.jpg', 'Mùa hoa mận', CURRENT_TIMESTAMP, 'dest-mb-05');
-- 3 áº£nh cho HÃ  Giang (dest-mb-06)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hg-01', '/images/destinations/hagiang01_des.webp', 'Hẻm Tu Sản', CURRENT_TIMESTAMP, 'dest-mb-06'),
('img-hg-02', '/images/destinations/hagiang02_des.jpg', 'Ruộng bậc thang Hoàng Su Phì', CURRENT_TIMESTAMP, 'dest-mb-06'),
('img-hg-03', '/images/destinations/hagiang03_des.webp', 'Làng Lô Lô Chải', CURRENT_TIMESTAMP, 'dest-mb-06');
-- 3 áº£nh cho CÃ¡t BÃ  (dest-mb-07)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-cb-01', '/images/destinations/catba01_des.jpg', 'Vịnh Lan Hạ', CURRENT_TIMESTAMP, 'dest-mb-07'),
('img-cb-02', '/images/destinations/catba02_des.jpg', 'Thị trấn Cát Bà về đêm', CURRENT_TIMESTAMP, 'dest-mb-07'),
('img-cb-03', '/images/destinations/catba03_des.jpg', 'Làng chài trên vịnh', CURRENT_TIMESTAMP, 'dest-mb-07');
-- 3 áº£nh cho Mai ChÃ¢u (dest-mb-08)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-maic-01', '/images/destinations/maichau01_des.jpg', 'Bản Lác', CURRENT_TIMESTAMP, 'dest-mb-08'),
('img-maic-02', '/images/destinations/maichau02_des.jpg', 'Toàn cảnh Mai Châu', CURRENT_TIMESTAMP, 'dest-mb-08'),
('img-maic-03', '/images/destinations/maichau03_des.jpg', 'Đạp xe ở Mai Châu', CURRENT_TIMESTAMP, 'dest-mb-08');
-- 3 áº£nh cho YÃªn Tá»­ (dest-mb-09)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-yt-01', '/images/destinations/yentu01_des.jpeg', 'Bình minh Yên Tử', CURRENT_TIMESTAMP, 'dest-mb-09'),
('img-yt-02', '/images/destinations/yentu02_des.jpg', 'Chùa Đồng', CURRENT_TIMESTAMP, 'dest-mb-09'),
('img-yt-03', '/images/destinations/yentu03_des.jpg', 'Tượng Phật hoàng', CURRENT_TIMESTAMP, 'dest-mb-09');
-- 3 áº£nh cho Ba VÃ¬ (dest-mb-10)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-bv-01', '/images/destinations/bavi01_des.jpg', 'Vườn quốc gia Ba Vì', CURRENT_TIMESTAMP, 'dest-mb-10'),
('img-bv-02', '/images/destinations/bavi02_des.jpg', 'Hồ Suối Hai', CURRENT_TIMESTAMP, 'dest-mb-10'),
('img-bv-03', '/images/destinations/bavi03_des.jpg', 'Nhà thờ cổ Ba Vì', CURRENT_TIMESTAMP, 'dest-mb-10');

-- 3 áº£nh cho Huáº¿ (dest-mt-01)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hue-01', '/images/destinations/hue01_des.jpg', 'Hoàng hôn ở Kinh thành Huế', CURRENT_TIMESTAMP, 'dest-mt-01'),
('img-hue-02', '/images/destinations/hue02_des.webp', 'Lăng Minh Mạng', CURRENT_TIMESTAMP, 'dest-mt-01'),
('img-hue-03', '/images/destinations/hue03_des.jpg', 'Cổng Ngọ Môn', CURRENT_TIMESTAMP, 'dest-mt-01');
-- 3 áº£nh cho ÄÃ  Náºµng (dest-mt-02)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-dn-01', '/images/destinations/danang01_des.jpg', 'Pháo hoa Đà Nẵng', CURRENT_TIMESTAMP, 'dest-mt-02'),
('img-dn-02', '/images/destinations/danang02_des.webp', 'Cầu Rồng về đêm', CURRENT_TIMESTAMP, 'dest-mt-02'),
('img-dn-03', '/images/destinations/danang03_des.png', 'Cầu Vàng Bà Nà', CURRENT_TIMESTAMP, 'dest-mt-02');
-- 3 áº£nh cho Há»™i An (dest-mt-03)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-ha-01', '/images/destinations/hoian01_des.webp', 'Chùa Cầu', CURRENT_TIMESTAMP, 'dest-mt-03'),
('img-ha-02', '/images/destinations/hoian02_des.png', 'Thả đèn hoa đăng', CURRENT_TIMESTAMP, 'dest-mt-03'),
('img-ha-03', '/images/destinations/hoian03_des.jpg', 'Phố cổ Hội An', CURRENT_TIMESTAMP, 'dest-mt-03');
-- 3 áº£nh cho PhÃº YÃªn (dest-mt-04)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-py-01', '/images/destinations/phuyen01_des.jpg', 'Gành Đá Đĩa', CURRENT_TIMESTAMP, 'dest-mt-04'),
('img-py-02', '/images/destinations/phuyen02_des.jpg', 'Bãi Xép', CURRENT_TIMESTAMP, 'dest-mt-04'),
('img-py-03', '/images/destinations/phuyen03_des.webp', 'Hải đăng Đại Lãnh', CURRENT_TIMESTAMP, 'dest-mt-04');
-- 3 áº£nh cho Nha Trang (dest-mt-05)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-nt-01', '/images/destinations/nhatrang01_des.webp', 'Vịnh Nha Trang', CURRENT_TIMESTAMP, 'dest-mt-05'),
('img-nt-02', '/images/destinations/nhatrang02_des.jpg', 'Bãi biển đẹp', CURRENT_TIMESTAMP, 'dest-mt-05'),
('img-nt-03', '/images/destinations/nhatrang03_des.webp', 'Đảo Hòn Mun', CURRENT_TIMESTAMP, 'dest-mt-05');
-- 3 áº£nh cho ÄÃ  Láº¡t (dest-mt-06)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-dl-01', '/images/destinations/dalat01_des.jpg', 'Hồ Tuyền Lâm', CURRENT_TIMESTAMP, 'dest-mt-06'),
('img-dl-02', '/images/destinations/dalat02_des.jpg', 'Thành phố mờ sương', CURRENT_TIMESTAMP, 'dest-mt-06'),
('img-dl-03', '/images/destinations/dalat03_des.webp', 'Đồi hoa', CURRENT_TIMESTAMP, 'dest-mt-06');
-- 3 áº£nh cho Quáº£ng BÃ¬nh (dest-mt-07)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-qb-01', '/images/destinations/quangbinh01_des.png', 'Thành phố Đồng Hới', CURRENT_TIMESTAMP, 'dest-mt-07'),
('img-qb-02', '/images/destinations/quangbinh02_des.jpg', 'Bình minh Phong Nha', CURRENT_TIMESTAMP, 'dest-mt-07'),
('img-qb-03', '/images/destinations/quangbinh03_des.jpg', 'Cổng thành cổ', CURRENT_TIMESTAMP, 'dest-mt-07');
-- 3 áº£nh cho BÃ¬nh Äá»‹nh (dest-mt-08)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-bd-01', '/images/destinations/binhdinh01_des.jpg', 'Cầu Thị Nại', CURRENT_TIMESTAMP, 'dest-mt-08'),
('img-bd-02', '/images/destinations/binhdinh02_des.jpg', 'Quy Nhơn về đêm', CURRENT_TIMESTAMP, 'dest-mt-08'),
('img-bd-03', '/images/destinations/binhdinh03_des.jpg', 'Eo Gió', CURRENT_TIMESTAMP, 'dest-mt-08');
-- 3 áº£nh cho Nghá»‡ An (dest-mt-09)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-na-01', '/images/destinations/nghean01_des.jpg', 'Bình minh Cửa Lò', CURRENT_TIMESTAMP, 'dest-mt-09'),
('img-na-02', '/images/destinations/nghean02_des.jpg', 'Làng Sen quê Bác', CURRENT_TIMESTAMP, 'dest-mt-09'),
('img-na-03', '/images/destinations/nghean03_des.jpg', 'Biển Cửa Lò', CURRENT_TIMESTAMP, 'dest-mt-09');
-- 3 áº£nh cho Quáº£ng Trá»‹ (dest-mt-10)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-qt-01', '/images/destinations/quangtri01_des.jpg', 'Cầu Hiền Lương', CURRENT_TIMESTAMP, 'dest-mt-10'),
('img-qt-02', '/images/destinations/quangtri02_des.webp', 'Nghĩa trang Trường Sơn', CURRENT_TIMESTAMP, 'dest-mt-10'),
('img-qt-03', '/images/destinations/quangtri03_des.jpg', 'Chèo thuyền', CURRENT_TIMESTAMP, 'dest-mt-10');

-- 3 áº£nh cho TP.HCM (dest-mn-01)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-hcm-01', '/images/destinations/hochiminh01_des.webp', 'UBND Thành phố', CURRENT_TIMESTAMP, 'dest-mn-01'),
('img-hcm-02', '/images/destinations/hochiminh02_des.jpg', 'Drone show', CURRENT_TIMESTAMP, 'dest-mn-01'),
('img-hcm-03', '/images/destinations/hochiminh03_des.jpg', 'Nhà thờ Đức Bà', CURRENT_TIMESTAMP, 'dest-mn-01');
-- 3 áº£nh cho PhÃº Quá»‘c (dest-mn-02)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-pq-01', '/images/destinations/phuquoc01_des.webp', 'Bãi Sao', CURRENT_TIMESTAMP, 'dest-mn-02'),
('img-pq-02', '/images/destinations/phuquoc02_des.jpg', 'Đảo Hòn Thơm', CURRENT_TIMESTAMP, 'dest-mn-02'),
('img-pq-03', '/images/destinations/phuquoc03_des.jpg', 'Cáp treo Hòn Thơm', CURRENT_TIMESTAMP, 'dest-mn-02');
-- 3 áº£nh cho Cáº§n ThÆ¡ (dest-mn-03)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-ct-01', '/images/destinations/cantho01_des.webp', 'Chợ nổi Cái Răng', CURRENT_TIMESTAMP, 'dest-mn-03'),
('img-ct-02', '/images/destinations/cantho02_des.jpg', 'Bến Ninh Kiều về đêm', CURRENT_TIMESTAMP, 'dest-mn-03'),
('img-ct-03', '/images/destinations/cantho03_des.jpg', 'Chợ Cần Thơ', CURRENT_TIMESTAMP, 'dest-mn-03');
-- 3 áº£nh cho Báº¿n Tre (dest-mn-04)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-bt-01', '/images/destinations/bentre01_des.webp', 'Rừng dừa Bến Tre', CURRENT_TIMESTAMP, 'dest-mn-04'),
('img-bt-02', '/images/destinations/bentre02_des.jpg', 'Du lịch sinh thái', CURRENT_TIMESTAMP, 'dest-mn-04'),
('img-bt-03', '/images/destinations/bentre03_des.jpg', 'Miệt vườn', CURRENT_TIMESTAMP, 'dest-mn-04');
-- 3 áº£nh cho VÅ©ng TÃ u (dest-mn-05)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-vt-01', '/images/destinations/vungtau01_des.jpg', 'Bãi Trước Vũng Tàu', CURRENT_TIMESTAMP, 'dest-mn-05'),
('img-vt-02', '/images/destinations/vungtau02_des.jpg', 'Cột cờ', CURRENT_TIMESTAMP, 'dest-mn-05'),
('img-vt-03', '/images/destinations/vungtau03_des.jpg', 'Tượng Chúa Kito', CURRENT_TIMESTAMP, 'dest-mn-05');
-- 3 áº£nh cho Äá»“ng ThÃ¡p (dest-mn-06)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-dt-01', '/images/destinations/dongthap01_des.jpg', 'Đồng sen Tháp Mười', CURRENT_TIMESTAMP, 'dest-mn-06'),
('img-dt-02', '/images/destinations/dongthap02_des..jpg', 'Làng hoa Sa Đéc', CURRENT_TIMESTAMP, 'dest-mn-06'),
('img-dt-03', '/images/destinations/dongthap03_des..jpg', 'Mùa sen nở', CURRENT_TIMESTAMP, 'dest-mn-06');
-- 3 áº£nh cho An Giang (dest-mn-07)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-ag-01', '/images/destinations/angiang01_des.jpg', 'Cánh đồng Tà Pạ', CURRENT_TIMESTAMP, 'dest-mn-07'),
('img-ag-02', '/images/destinations/angiang02_des.jpg', 'Miếu Bà Chúa Xứ', CURRENT_TIMESTAMP, 'dest-mn-07'),
('img-ag-03', '/images/destinations/angiang03_des.jpg', 'Chợ nổi Long Xuyên', CURRENT_TIMESTAMP, 'dest-mn-07');
-- 3 áº£nh cho TÃ¢y Ninh (dest-mn-08)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-tn-01', '/images/destinations/tayninh01_des.jpg', 'Núi Bà Đen', CURRENT_TIMESTAMP, 'dest-mn-08'),
('img-tn-02', '/images/destinations/tayninh02_des.jpg', 'Tòa Thánh Tây Ninh', CURRENT_TIMESTAMP, 'dest-mn-08'),
('img-tn-03', '/images/destinations/tayninh03_des.webp', 'Toàn cảnh Tòa Thánh', CURRENT_TIMESTAMP, 'dest-mn-08');
-- 3 áº£nh cho CÃ  Mau (dest-mn-09)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-cama-01', '/images/destinations/camau01_des.jpg', 'Cột mốc Mũi Cà Mau', CURRENT_TIMESTAMP, 'dest-mn-09'),
('img-cama-02', '/images/destinations/camau02_des.png', 'TP. Cà Mau', CURRENT_TIMESTAMP, 'dest-mn-09'),
('img-cama-03', '/images/destinations/camau03_des.jpg', 'Biểu tượng Cà Mau', CURRENT_TIMESTAMP, 'dest-mn-09');
-- 3 áº£nh cho Báº¡c LiÃªu (dest-mn-10)
INSERT INTO images (imageid, url, caption, created_at, destination_id) VALUES
('img-bl-01', '/images/destinations/baclieu01_des.jpeg', 'Nhà hát Cao Văn Lầu', CURRENT_TIMESTAMP, 'dest-mn-10'),
('img-bl-02', '/images/destinations/baclieu02_des.jpg', 'Đờn ca tài tử', CURRENT_TIMESTAMP, 'dest-mn-10'),
('img-bl-03', '/images/destinations/baclieu03_des.jpg', 'Điện gió Bạc Liêu', CURRENT_TIMESTAMP, 'dest-mn-10');


-- =================================================================
-- 4. Báº¢NG TOURS (30 Tours)
-- =================================================================

-- Miá»n Báº¯c (10)
INSERT INTO tours (tourid, title, "description", start_date, end_date, duration_days, duration_nights, departure_place, price_adult, price_child, max_participants, min_participants, imageurl, status, ranking, tour_type_id) VALUES
('tour-001', 'Hà Nội: Trái tim ngàn năm văn hiến 2N1Đ', 'Khám phá 36 phố phường, Lăng Bác, Văn Miếu Quốc Tử Giám và thưởng thức ẩm thực đường phố.', '2025-04-10', '2025-04-11', 2, 1, 'TP. Hồ Chí Minh', 2200000, 1500000, 25, 5, '/images/tours/hanoi_tour.webp', 'ACTIVE', 1, 'type-03'),
('tour-002', 'Vịnh Hạ Long 2N1Đ: Ngủ đêm Du thuyền 5*', 'Trải nghiệm ngủ đêm trên vịnh di sản, chèo kayak, thăm hang Sửng Sốt và tắm biển Titop.', '2025-05-15', '2025-05-16', 2, 1, 'Hà Nội', 2890000, 2000000, 20, 10, '/images/tours/halong_tour.jpg', 'ACTIVE', 2, 'type-01'),
('tour-003', 'Sa Pa 3N2Đ: Chinh phục Fansipan & bản Cát Cát', 'Săn mây trên "Nóc nhà Đông Dương", khám phá văn hóa người H''Mông và ruộng bậc thang.', '2025-09-20', '2025-09-22', 3, 2, 'Hà Nội', 3500000, 2500000, 30, 8, '/images/tours/sapa_cover.jpg', 'ACTIVE', 3, 'type-02'),
('tour-004', 'Ninh Bình 2N1Đ: Tràng An - Bái Đính - Hang Múa', 'Khám phá di sản kép Tràng An, leo đỉnh Hang Múa ngắm Tam Cốc và viếng chùa Bái Đính.', '2025-04-20', '2025-04-21', 2, 1, 'Hà Nội', 2100000, 1400000, 25, 5, '/images/tours/ninhbinh_tour.jpg', 'ACTIVE', 4, 'type-03'),
('tour-005', 'Mộc Châu 2N1Đ: Mùa hoa cải & Đồi chè trái tim', 'Đắm chìm trong sắc trắng hoa cải, không khí trong lành và check-in đồi chè xanh ngát.', '2025-11-10', '2025-11-11', 2, 1, 'Hà Nội', 1900000, 1300000, 20, 10, '/images/tours/mocchau_tour.jpg', 'ACTIVE', 5, 'type-02'),
('tour-006', 'Hà Giang 4N3Đ: Cung đường Hạnh Phúc', 'Phiêu lưu qua cao nguyên đá Đồng Văn, Mã Pì Lèng, cột cờ Lũng Cú và sông Nho Quế.', '2025-10-15', '2025-10-18', 4, 3, 'Hà Nội', 4800000, 3500000, 15, 6, '/images/tours/hagiang_tour.jpg', 'ACTIVE', 6, 'type-05'),
('tour-007', 'Cát Bà - Vịnh Lan Hạ 3N2Đ: Chèo Kayak & Tắm biển', 'Khám phá vẻ đẹp hoang sơ của Vịnh Lan Hạ, chèo kayak qua các hang động và thư giãn tại bãi tắm.', '2025-06-05', '2025-06-07', 3, 2, 'Hà Nội', 3200000, 2200000, 30, 10, '/images/tours/catba_tour.jpg', 'ACTIVE', 7, 'type-01'),
('tour-008', 'Mai Châu 2N1Đ: Trải nghiệm bản Lác', 'Nghỉ đêm tại nhà sàn truyền thống, đạp xe qua những cánh đồng lúa và xem múa dân tộc.', '2025-05-01', '2025-05-02', 2, 1, 'Hà Nội', 1750000, 1200000, 25, 5, '/images/tours/maichau_tour.png', 'ACTIVE', 8, 'type-03'),
('tour-009', 'Yên Tử 2N1Đ: Hành hương về đất Phật', 'Đi cáp treo lên Chùa Đồng, viếng chùa Hoa Yên và tìm về chốn bình yên tâm linh.', '2025-03-10', '2025-03-11', 2, 1, 'Hà Nội', 2000000, 1400000, 30, 10, '/images/tours/yentu_tour.jpg', 'ACTIVE', 9, 'type-03'),
('tour-010', 'Ba Vì 1N: Vườn quốc gia & Nhà thờ cổ', 'Trải nghiệm 1 ngày dã ngoại, hít thở không khí trong lành tại Vườn quốc gia và check-in nhà thờ cổ.', '2025-04-15', '2025-04-15', 1, 0, 'Hà Nội', 800000, 600000, 40, 15, '/images/tours/bavi_tour.jpg', 'ACTIVE', 10, 'type-02'),
-- Miá»n Trung (10)
('tour-011', 'Huế 3N2Đ: Dòng chảy lịch sử Cố Đô', 'Thăm Kinh thành Huế, các lăng tẩm Vua triều Nguyễn, chùa Thiên Mụ và nghe ca Huế trên sông Hương.', '2025-04-25', '2025-04-27', 3, 2, 'Hà Nội', 3600000, 2600000, 25, 5, '/images/tours/kinhthanhhue_tour.jpg', 'ACTIVE', 11, 'type-03'),
('tour-012', 'Đà Nẵng 3N2Đ: Thành phố Cầu Rồng', 'Tắm biển Mỹ Khê, khám phá Bà Nà Hills, Ngũ Hành Sơn và xem Cầu Rồng phun lửa.', '2025-06-10', '2025-06-12', 3, 2, 'TP. Hồ Chí Minh', 3800000, 2800000, 30, 10, '/images/tours/danang_tour.jpg', 'ACTIVE', 12, 'type-01'),
('tour-013', 'Hội An 2N1Đ: Đêm Phố Cổ lung linh', 'Dạo bước phố cổ đèn lồng, thả hoa đăng, thưởng thức Cao Lầu và may đồ lấy liền.', '2025-05-10', '2025-05-11', 2, 1, 'Đà Nẵng', 1950000, 1400000, 25, 5, '/images/tours/hoian_cover.jpg', 'ACTIVE', 13, 'type-03'),
('tour-014', 'Phú Yên 3N2Đ: Xứ sở Hoa Vàng Cỏ Xanh', 'Check-in Gành Đá Đĩa độc đáo, Bãi Xép, Mũi Điện và thưởng thức hải sản tươi ngon.', '2025-07-01', '2025-07-03', 3, 2, 'Hà Nội', 4100000, 3000000, 20, 8, '/images/tours/phuyen_tour.jpg', 'ACTIVE', 14, 'type-01'),
('tour-015', 'Nha Trang 3N2Đ: Thiên đường biển gọi', 'Vui chơi tại VinWonders, lặn ngắm san hô tại Hòn Mun và thư giãn trên bãi biển dài.', '2025-06-15', '2025-06-17', 3, 2, 'TP. Hồ Chí Minh', 3300000, 2400000, 30, 10, '/images/tours/nhatrang_tour.jpg', 'ACTIVE', 15, 'type-01'),
('tour-016', 'Đà Lạt 3N2Đ: Thành phố ngàn hoa', 'Săn mây Cầu Đất, dạo Hồ Xuân Hương, check-in các quán cafe view đồi và thưởng thức ẩm thực đêm.', '2025-08-20', '2025-08-22', 3, 2, 'TP. Hồ Chí Minh', 2900000, 2100000, 25, 5, '/images/tours/dalat_cover.jpg', 'ACTIVE', 16, 'type-02'),
('tour-017', 'Quảng Bình 3N2Đ: Khám phá Phong Nha - Kẻ Bàng', 'Du thuyền trên sông Son, khám phá động Phong Nha, động Thiên Đường và tắm suối Moọc.', '2025-07-10', '2025-07-12', 3, 2, 'Hà Nội', 4500000, 3300000, 20, 8, '/images/tours/quangbinh.jpg', 'ACTIVE', 17, 'type-05'),
('tour-018', 'Bình Định 3N2Đ: Kỳ Co - Eo Gió', 'Khám phá "Maldives của Việt Nam" tại Kỳ Co, ngắm hoàng hôn ở Eo Gió và thăm tháp Chăm.', '2025-06-20', '2025-06-22', 3, 2, 'Hà Nội', 3900000, 2900000, 25, 5, '/images/tours/binhdinh_tour.jpg', 'ACTIVE', 18, 'type-01'),
('tour-019', 'Nghệ An 2N1Đ: Về Làng Sen thăm quê Bác', 'Thăm Làng Sen quê Bác, tắm biển Cửa Lò và thưởng thức cháo lươn Nghệ An.', '2025-05-18', '2025-05-19', 2, 1, 'Hà Nội', 2300000, 1600000, 30, 10, '/images/tours/nghean_tour.jpg', 'ACTIVE', 19, 'type-03'),
('tour-020', 'Quảng Trị 2N1Đ: Hành trình DMZ', 'Thăm lại chiến trường xưa: Thành cổ Quảng Trị, cầu Hiền Lương, sông Bến Hải, địa đạo Vịnh Mốc.', '2025-04-29', '2025-04-30', 2, 1, 'Huế', 2500000, 1800000, 20, 8, '/images/tours/quangtri.webp', 'ACTIVE', 20, 'type-03'),
-- Miá»n Nam (10)
('tour-021', 'TP. Hồ Chí Minh 2N1Đ: Hòn ngọc Viễn Đông', 'Khám phá Dinh Độc Lập, Bưu điện Thành phố, Nhà thờ Đức Bà và trải nghiệm ẩm thực sôi động.', '2025-03-20', '2025-03-21', 2, 1, 'Hà Nội', 2400000, 1700000, 25, 5, '/images/tours/hochiminh_tour.webp', 'ACTIVE', 21, 'type-03'),
('tour-022', 'Phú Quốc 3N2Đ: Đảo ngọc Rực rỡ', 'Nghỉ dưỡng tại resort 5*, vui chơi Grand World, Safari và đi cáp treo Hòn Thơm dài nhất thế giới.', '2025-07-05', '2025-07-07', 3, 2, 'TP. Hồ Chí Minh', 4500000, 3200000, 30, 10, '/images/tours/phuquoc_cover.jpg', 'ACTIVE', 22, 'type-01'),
('tour-023', 'Cần Thơ 2N1Đ: Tây Đô Sông Nước', 'Trải nghiệm Chợ nổi Cái Răng lúc sáng sớm, dạo Bến Ninh Kiều và thưởng thức đờn ca tài tử.', '2025-05-05', '2025-05-06', 2, 1, 'TP. Hồ Chí Minh', 1800000, 1300000, 25, 5, '/images/tours/cantho_tour.jpeg', 'ACTIVE', 23, 'type-04'),
('tour-024', 'Bến Tre 1N: Xứ Dừa Miệt Vườn', 'Đi thuyền trên rạch dừa, thăm lò làm kẹo dừa, nghe đờn ca tài tử và thưởng thức trái cây tại vườn.', '2025-04-12', '2025-04-12', 1, 0, 'TP. Hồ Chí Minh', 750000, 550000, 40, 15, '/images/tours/bentre_tour.webp', 'ACTIVE', 24, 'type-04'),
('tour-025', 'Vũng Tàu 2N1Đ: Biển Vẫy Gọi', 'Tắm biển Bãi Sau, leo Tượng Chúa Kito Vua ngắm toàn cảnh thành phố và ăn hải sản đêm.', '2025-05-24', '2025-05-25', 2, 1, 'TP. Hồ Chí Minh', 1900000, 1400000, 30, 10, '/images/tours/vungtau_tour.jpg', 'ACTIVE', 25, 'type-01'),
('tour-026', 'Đồng Tháp 2N1Đ: Đồng sen Tháp Mười', 'Ngắm sen nở rộ tại Tháp Mười, tham quan Vườn quốc gia Tràm Chim và làng hoa Sa Đéc.', '2025-08-10', '2025-08-11', 2, 1, 'TP. Hồ Chí Minh', 2000000, 1500000, 20, 8, '/images/tours/dongthap_tour.jpg', 'ACTIVE', 26, 'type-03'),
('tour-027', 'An Giang 3N2Đ: Về miền Thất Sơn', 'Viếng Miếu Bà Chúa Xứ Núi Sam, đi thuyền rừng tràm Trà Sư và khám phá chợ Châu Đốc.', '2025-09-01', '2025-09-03', 3, 2, 'TP. Hồ Chí Minh', 3100000, 2200000, 25, 5, '/images/tours/angiang_tour.jpg', 'ACTIVE', 27, 'type-03'),
('tour-028', 'Tây Ninh 1N: Chinh phục nóc nhà Nam Bộ', 'Đi cáp treo lên Núi Bà Đen, viếng chùa Bà và tham quan Tòa Thánh Cao Đài nguy nga.', '2025-03-30', '2025-03-30', 1, 0, 'TP. Hồ Chí Minh', 850000, 650000, 40, 15, '/images/tours/tayninh_tour.jpg', 'ACTIVE', 28, 'type-02'),
('tour-029', 'Cà Mau 2N1Đ: Về Đất Mũi Cực Nam', 'Chạm tay vào cột mốc Cực Nam tổ quốc, đi cano xuyên rừng ngập mặn và ngắm hoàng hôn Đất Mũi.', '2025-10-10', '2025-10-11', 2, 1, 'Cần Thơ', 2600000, 1900000, 20, 8, '/images/tours/hochiminh_tour.webp', 'ACTIVE', 29, 'type-03'), -- Táº¡m dÃ¹ng áº£nh HCM
('tour-030', 'Bạc Liêu 2N1Đ: Giai thoại Công tử', 'Thăm nhà Công tử Bạc Liêu, cánh đồng điện gió và nghe đờn ca tài tử tại nhà hát Cao Văn Lầu.', '2025-08-05', '2025-08-06', 2, 1, 'Cần Thơ', 2400000, 1700000, 25, 5, '/images/tours/baclieu.jpg', 'ACTIVE', 30, 'type-03');


-- =================================================================
-- 5. Báº¢NG LIÃŠN Káº¾T N-N (TourDestinations, TourPromotions)
-- =================================================================

-- TourDestinations (30 dÃ²ng - Má»—i tour 1 Ä‘iá»ƒm Ä‘áº¿n chÃ­nh)
INSERT INTO tour_destinations (tour_destinationid, tour_id, destination_id) VALUES
('td-001', 'tour-001', 'dest-mb-01'), ('td-002', 'tour-002', 'dest-mb-02'), ('td-003', 'tour-003', 'dest-mb-03'),
('td-004', 'tour-004', 'dest-mb-04'), ('td-005', 'tour-005', 'dest-mb-05'), ('td-006', 'tour-006', 'dest-mb-06'),
('td-007', 'tour-007', 'dest-mb-07'), ('td-008', 'tour-008', 'dest-mb-08'), ('td-009', 'tour-009', 'dest-mb-09'),
('td-010', 'tour-010', 'dest-mb-10'), ('td-011', 'tour-011', 'dest-mt-01'), ('td-012', 'tour-012', 'dest-mt-02'),
('td-013', 'tour-013', 'dest-mt-03'), ('td-014', 'tour-014', 'dest-mt-04'), ('td-015', 'tour-015', 'dest-mt-05'),
('td-016', 'tour-016', 'dest-mt-06'), ('td-017', 'tour-017', 'dest-mt-07'), ('td-018', 'tour-018', 'dest-mt-08'),
('td-019', 'tour-019', 'dest-mt-09'), ('td-020', 'tour-020', 'dest-mt-10'), ('td-021', 'tour-021', 'dest-mn-01'),
('td-022', 'tour-022', 'dest-mn-02'), ('td-023', 'tour-023', 'dest-mn-03'), ('td-024', 'tour-024', 'dest-mn-04'),
('td-025', 'tour-025', 'dest-mn-05'), ('td-026', 'tour-026', 'dest-mn-06'), ('td-027', 'tour-027', 'dest-mn-07'),
('td-028', 'tour-028', 'dest-mn-08'), ('td-029', 'tour-029', 'dest-mn-09'), ('td-030', 'tour-030', 'dest-mn-10');

-- TourPromotions (30 dÃ²ng - Má»—i tour 1 khuyáº¿n mÃ£i)
INSERT INTO tour_promotions (tour_promotionid, tour_id, promotion_id) VALUES
('tp-001', 'tour-001', 'promo-001'), ('tp-002', 'tour-002', 'promo-002'), ('tp-003', 'tour-003', 'promo-003'),
('tp-004', 'tour-004', 'promo-004'), ('tp-005', 'tour-005', 'promo-005'), ('tp-006', 'tour-006', 'promo-006'),
('tp-007', 'tour-007', 'promo-007'), ('tp-008', 'tour-008', 'promo-008'), ('tp-009', 'tour-009', 'promo-009'),
('tp-010', 'tour-010', 'promo-010'), ('tp-011', 'tour-011', 'promo-011'), ('tp-012', 'tour-012', 'promo-012'),
('tp-013', 'tour-013', 'promo-013'), ('tp-014', 'tour-014', 'promo-014'), ('tp-015', 'tour-015', 'promo-015'),
('tp-016', 'tour-016', 'promo-016'), ('tp-017', 'tour-017', 'promo-017'), ('tp-018', 'tour-018', 'promo-018'),
('tp-019', 'tour-019', 'promo-019'), ('tp-020', 'tour-020', 'promo-020'), ('tp-021', 'tour-021', 'promo-021'),
('tp-022', 'tour-022', 'promo-022'), ('tp-023', 'tour-023', 'promo-023'), ('tp-024', 'tour-024', 'promo-024'),
('tp-025', 'tour-025', 'promo-025'), ('tp-026', 'tour-026', 'promo-026'), ('tp-027', 'tour-027', 'promo-027'),
('tp-028', 'tour-028', 'promo-028'), ('tp-029', 'tour-029', 'promo-029'), ('tp-030', 'tour-030', 'promo-030');


-- =================================================================
-- 6. THÆ¯ VIá»†N áº¢NH TOUR (TourImages) - (90 áº£nh)
-- =================================================================

-- (Táº¡m dÃ¹ng áº£nh destinations lÃ m áº£nh gallery tour cho 30 tour)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
-- Tour 001 (HÃ  Ná»™i)
('timg-001-1', '/images/destinations/hanoi_des.jpg', 'Tháp Rùa', 'tour-001'),
('timg-001-2', '/images/destinations/hanoi02_des.jpg', 'Hà Nội đêm', 'tour-001'),
('timg-001-3', '/images/destinations/hanoi03_des.jpg', 'Phố cổ', 'tour-001'),
-- Tour 002 (Háº¡ Long)
('timg-002-1', '/images/destinations/halong01_des.jpg', 'Vịnh', 'tour-002'),
('timg-002-2', '/images/destinations/halong02_des.jpg', 'Du thuyền', 'tour-002'),
('timg-002-3', '/images/destinations/halong03_des.jpg', 'Toàn cảnh', 'tour-002'),
-- Tour 003 (Sapa)
('timg-003-1', '/images/destinations/sapa01_des.webp', 'Đỉnh Fansipan', 'tour-003'),
('timg-003-2', '/images/destinations/sapa02_des.jpg', 'Thị trấn', 'tour-003'),
('timg-003-3', '/images/destinations/sapa03_des.webp', 'Tuyết', 'tour-003'),
-- Tour 004 (Ninh BÃ¬nh)
('timg-004-1', '/images/destinations/ninhbinh01_des.jpg', 'Tràng An', 'tour-004'),
('timg-004-2', '/images/destinations/ninhbinh02_des.jpg', 'Tam Cốc', 'tour-004'),
('timg-004-3', '/images/destinations/ninhbinh03_des.webp', 'Hoàng hôn', 'tour-004'),
-- Tour 005 (Má»™c ChÃ¢u)
('timg-005-1', '/images/destinations/mocchau01_des.webp', 'Đồi chè', 'tour-005'),
('timg-005-2', '/images/destinations/mocchau02_des.jpg', 'Ruộng bậc thang', 'tour-005'),
('timg-005-3', '/images/destinations/mocchau03_des.jpg', 'Mùa hoa', 'tour-005'),
-- Tour 006 (HÃ  Giang)
('timg-006-1', '/images/destinations/hagiang01_des.webp', 'Hẻm Tu Sản', 'tour-006'),
('timg-006-2', '/images/destinations/hagiang02_des.jpg', 'Hoàng Su Phì', 'tour-006'),
('timg-006-3', '/images/destinations/hagiang03_des.webp', 'Làng Lô Lô Chải', 'tour-006'),
-- Tour 007 (CÃ¡t BÃ )
('timg-007-1', '/images/destinations/catba01_des.jpg', 'Vịnh Lan Hạ', 'tour-007'),
('timg-007-2', '/images/destinations/catba02_des.jpg', 'Thị trấn Cát Bà', 'tour-007'),
('timg-007-3', '/images/destinations/catba03_des.jpg', 'Làng chài', 'tour-007'),
-- Tour 008 (Mai ChÃ¢u)
('timg-008-1', '/images/destinations/maichau01_des.jpg', 'Bản Lác', 'tour-008'),
('timg-008-2', '/images/destinations/maichau02_des.jpg', 'Toàn cảnh', 'tour-008'),
('timg-008-3', '/images/destinations/maichau03_des.jpg', 'Đạp xe', 'tour-008'),
-- Tour 009 (YÃªn Tá»­)
('timg-009-1', '/images/destinations/yentu01_des.jpeg', 'Bình minh', 'tour-009'),
('timg-009-2', '/images/destinations/yentu02_des.jpg', 'Chùa Đồng', 'tour-009'),
('timg-009-3', '/images/destinations/yentu03_des.jpg', 'Tượng Phật', 'tour-009'),
-- Tour 010 (Ba VÃ¬)
('timg-010-1', '/images/destinations/bavi01_des.jpg', 'Vườn quốc gia', 'tour-010'),
('timg-010-2', '/images/destinations/bavi02_des.jpg', 'Hồ Suối Hai', 'tour-010'),
('timg-010-3', '/images/destinations/bavi03_des.jpg', 'Nhà thờ cổ', 'tour-010'),
-- Tour 011 (Huáº¿)
('timg-011-1', '/images/destinations/hue01_des.jpg', 'Hoàng hôn', 'tour-011'),
('timg-011-2', '/images/destinations/hue02_des.webp', 'Lăng Minh Mạng', 'tour-011'),
('timg-011-3', '/images/destinations/hue03_des.jpg', 'Ngọ Môn', 'tour-011'),
-- Tour 012 (ÄÃ  Náºµng)
('timg-012-1', '/images/destinations/danang01_des.jpg', 'Pháo hoa', 'tour-012'),
('timg-012-2', '/images/destinations/danang02_des.webp', 'Cầu Rồng', 'tour-012'),
('timg-012-3', '/images/destinations/danang03_des.png', 'Cầu Vàng', 'tour-012'),
-- Tour 013 (Há»™i An)
('timg-013-1', '/images/destinations/hoian01_des.webp', 'Chùa Cầu', 'tour-013'),
('timg-013-2', '/images/destinations/hoian02_des.png', 'Hoa đăng', 'tour-013'),
('timg-013-3', '/images/destinations/hoian03_des.jpg', 'Phố cổ', 'tour-013'),
-- Tour 014 (PhÃº YÃªn)
('timg-014-1', '/images/destinations/phuyen01_des.jpg', 'Gành Đá Đĩa', 'tour-014'),
('timg-014-2', '/images/destinations/phuyen02_des.jpg', 'Bãi Xép', 'tour-014'),
('timg-014-3', '/images/destinations/phuyen03_des.webp', 'Hải đăng', 'tour-014'),
-- Tour 015 (Nha Trang)
('timg-015-1', '/images/destinations/nhatrang01_des.webp', 'Vịnh', 'tour-015'),
('timg-015-2', '/images/destinations/nhatrang02_des.jpg', 'Bãi biển', 'tour-015'),
('timg-015-3', '/images/destinations/nhatrang03_des.webp', 'Hòn Mun', 'tour-015'),
-- Tour 016 (ÄÃ  Láº¡t)
('timg-016-1', '/images/destinations/dalat01_des.jpg', 'Hồ Tuyền Lâm', 'tour-016'),
('timg-016-2', '/images/destinations/dalat02_des.jpg', 'Thành phố', 'tour-016'),
('timg-016-3', '/images/destinations/dalat03_des.webp', 'Đồi hoa', 'tour-016'),
-- Tour 017 (Quáº£ng BÃ¬nh)
('timg-017-1', '/images/destinations/quangbinh01_des.png', 'Đồng Hới', 'tour-017'),
('timg-017-2', '/images/destinations/quangbinh02_des.jpg', 'Bình minh', 'tour-017'),
('timg-017-3', '/images/destinations/quangbinh03_des.jpg', 'Cổng thành', 'tour-017'),
-- Tour 018 (BÃ¬nh Äá»‹nh)
('timg-018-1', '/images/destinations/binhdinh01_des.jpg', 'Cầu Thị Nại', 'tour-018'),
('timg-018-2', '/images/destinations/binhdinh02_des.jpg', 'Quy Nhơn', 'tour-018'),
('timg-018-3', '/images/destinations/binhdinh03_des.jpg', 'Eo Gió', 'tour-018'),
-- Tour 019 (Nghá»‡ An)
('timg-019-1', '/images/destinations/nghean01_des.jpg', 'Bình minh', 'tour-019'),
('timg-019-2', '/images/destinations/nghean02_des.jpg', 'Làng Sen', 'tour-019'),
('timg-019-3', '/images/destinations/nghean03_des.jpg', 'Cửa Lò', 'tour-019'),
-- Tour 020 (Quáº£ng Trá»‹)
('timg-020-1', '/images/destinations/quangtri01_des.jpg', 'Cầu Hiền Lương', 'tour-020'),
('timg-020-2', '/images/destinations/quangtri02_des.webp', 'Nghĩa trang', 'tour-020'),
('timg-020-3', '/images/destinations/quangtri03_des.jpg', 'Chèo thuyền', 'tour-020'),
-- Tour 021 (TP.HCM)
('timg-021-1', '/images/destinations/hochiminh01_des.webp', 'UBND', 'tour-021'),
('timg-021-2', '/images/destinations/hochiminh02_des.jpg', 'Drone', 'tour-021'),
('timg-021-3', '/images/destinations/hochiminh03_des.jpg', 'Nhà thờ Đức Bà', 'tour-021'),
-- Tour 022 (PhÃº Quá»‘c)
('timg-022-1', '/images/destinations/phuquoc01_des.webp', 'Bãi Sao', 'tour-022'),
('timg-022-2', '/images/destinations/phuquoc02_des.jpg', 'Hòn Thơm', 'tour-022'),
('timg-022-3', '/images/destinations/phuquoc03_des.jpg', 'Cáp treo', 'tour-022'),
-- Tour 023 (Cáº§n ThÆ¡)
('timg-023-1', '/images/destinations/cantho01_des.webp', 'Chợ nổi', 'tour-023'),
('timg-023-2', '/images/destinations/cantho02_des.jpg', 'Bến Ninh Kiều', 'tour-023'),
('timg-023-3', '/images/destinations/cantho03_des.jpg', 'Chợ Cần Thơ', 'tour-023'),
-- Tour 024 (Báº¿n Tre)
('timg-024-1', '/images/destinations/bentre01_des.webp', 'Rừng dừa', 'tour-024'),
('timg-024-2', '/images/destinations/bentre02_des.jpg', 'Sinh thái', 'tour-024'),
('timg-024-3', '/images/destinations/bentre03_des.jpg', 'Miệt vườn', 'tour-024'),
-- Tour 025 (VÅ©ng TÃ u)
('timg-025-1', '/images/destinations/vungtau01_des.jpg', 'Bãi Trước', 'tour-025'),
('timg-025-2', '/images/destinations/vungtau02_des.jpg', 'Cột cờ', 'tour-025'),
('timg-025-3', '/images/destinations/vungtau03_des.jpg', 'Tượng Chúa', 'tour-025'),
-- Tour 026 (Äá»“ng ThÃ¡p)
('timg-026-1', '/images/destinations/dongthap01_des.jpg', 'Đồng sen', 'tour-026'),
('timg-026-2', '/images/destinations/dongthap02_des..jpg', 'Làng hoa', 'tour-026'),
('timg-026-3', '/images/destinations/dongthap03_des..jpg', 'Mùa sen', 'tour-026'),
-- Tour 027 (An Giang)
('timg-027-1', '/images/destinations/angiang01_des.jpg', 'Tà Pạ', 'tour-027'),
('timg-027-2', '/images/destinations/angiang02_des.jpg', 'Miếu Bà', 'tour-027'),
('timg-027-3', '/images/destinations/angiang03_des.jpg', 'Chợ nổi', 'tour-027'),
-- Tour 028 (TÃ¢y Ninh)
('timg-028-1', '/images/destinations/tayninh01_des.jpg', 'Núi Bà Đen', 'tour-028'),
('timg-028-2', '/images/destinations/tayninh02_des.jpg', 'Tòa Thánh', 'tour-028'),
('timg-028-3', '/images/destinations/tayninh03_des.webp', 'Toàn cảnh', 'tour-028'),
-- Tour 029 (CÃ  Mau)
('timg-029-1', '/images/destinations/camau01_des.jpg', 'Cột mốc', 'tour-029'),
('timg-029-2', '/images/destinations/camau02_des.png', 'TP. Cà Mau', 'tour-029'),
('timg-029-3', '/images/destinations/camau03_des.jpg', 'Biểu tượng', 'tour-029'),
-- Tour 030 (Báº¡c LiÃªu)
('timg-030-1', '/images/destinations/baclieu01_des.jpeg', 'Nhà hát', 'tour-030'),
('timg-030-2', '/images/destinations/baclieu02_des.jpg', 'Đờn ca', 'tour-030'),
('timg-030-3', '/images/destinations/baclieu03_des.jpg', 'Điện gió', 'tour-030');


-- =================================================================
-- 7. Lá»ŠCH TRÃŒNH MáºªU (Itineraries) - (60 dÃ²ng)
-- =================================================================

-- 2 ngÃ y cho má»—i tour (30 * 2 = 60)
INSERT INTO itineraries (itineraryid, day_number, title, "description", tour_id) VALUES
('iti-001-d1', 1, 'Ngày 1: Lăng Bác - Văn Miếu', 'Khám phá Lăng Bác và Văn Miếu Quốc Tử Giám.', 'tour-001'),
('iti-001-d2', 2, 'Ngày 2: Phố Cổ - Hồ Gươm', 'Dạo quanh 36 phố phường và Hồ Gươm.', 'tour-001'),
('iti-002-d1', 1, 'Ngày 1: Lên du thuyền 5*', 'Lên du thuyền, ăn trưa, thăm hang Sửng Sốt.', 'tour-002'),
('iti-002-d2', 2, 'Ngày 2: Chèo Kayak - Về Hà Nội', 'Sáng chèo Kayak, ăn trưa và trở về Hà Nội.', 'tour-002'),
('iti-003-d1', 1, 'Ngày 1: Bản Cát Cát', 'Đến Sapa, nhận phòng, trekking bản Cát Cát.', 'tour-003'),
('iti-003-d2', 2, 'Ngày 2: Fansipan', 'Đi cáp treo chinh phục "Nóc nhà Đông Dương".', 'tour-003'),
('iti-004-d1', 1, 'Ngày 1: Chùa Bái Đính', 'Thăm chùa Bái Đính, khu chùa lớn nhất Việt Nam.', 'tour-004'),
('iti-004-d2', 2, 'Ngày 2: Tràng An - Hang Múa', 'Du thuyền Tràng An, leo Hang Múa.', 'tour-004'),
('iti-005-d1', 1, 'Ngày 1: Đồi chè Mộc Châu', 'Check-in đồi chè trái tim, thác Dải Yếm.', 'tour-005'),
('iti-005-d2', 2, 'Ngày 2: Rừng thông Bản Áng', 'Khám phá rừng thông, vườn dâu tây.', 'tour-005'),
('iti-006-d1', 1, 'Ngày 1: Cổng trời Quản Bạ', 'Check-in Cổng trời Quản Bạ, Núi đôi Cô Tiên.', 'tour-006'),
('iti-006-d2', 2, 'Ngày 2: Cột cờ Lũng Cú', 'Thăm Cột cờ Lũng Cú, điểm cực Bắc.', 'tour-006'),
('iti-007-d1', 1, 'Ngày 1: Vịnh Lan Hạ', 'Tắm biển, chèo kayak tại Vịnh Lan Hạ.', 'tour-007'),
('iti-007-d2', 2, 'Ngày 2: Làng chài Cái Bèo', 'Thăm làng chài cổ, pháo đài Thần Công.', 'tour-007'),
('iti-008-d1', 1, 'Ngày 1: Bản Lác', 'Trải nghiệm nhà sàn, đạp xe quanh bản Lác.', 'tour-008'),
('iti-008-d2', 2, 'Ngày 2: Đèo Thung Khe', 'Check-in đèo Thung Khe, trở về Hà Nội.', 'tour-008'),
('iti-009-d1', 1, 'Ngày 1: Chùa Hoa Yên', 'Hành hương, đi cáp treo lên chùa Hoa Yên.', 'tour-009'),
('iti-009-d2', 2, 'Ngày 2: Chùa Đồng', 'Lên Chùa Đồng, trở về.', 'tour-009'),
('iti-010-d1', 1, 'Ngày 1: VQG Ba Vì', 'Khám phá Vườn quốc gia, nhà thờ cổ.', 'tour-010'),
('iti-010-d2', 2, 'Ngày 2: Đền Thượng', 'Leo Đền Thượng, ngắm cảnh.', 'tour-010'),
('iti-011-d1', 1, 'Ngày 1: Kinh thành Huế', 'Thăm Đại Nội, Kinh thành Huế.', 'tour-011'),
('iti-011-d2', 2, 'Ngày 2: Lăng tẩm', 'Thăm Lăng Khải Định, Lăng Minh Mạng.', 'tour-011'),
('iti-012-d1', 1, 'Ngày 1: Biển Mỹ Khê', 'Tắm biển Mỹ Khê, Ngũ Hành Sơn.', 'tour-012'),
('iti-012-d2', 2, 'Ngày 2: Bà Nà Hills', 'Khám phá Cầu Vàng, Bà Nà Hills.', 'tour-012'),
('iti-013-d1', 1, 'Ngày 1: Phố cổ', 'Dạo phố cổ, Chùa Cầu, thả hoa đăng.', 'tour-013'),
('iti-013-d2', 2, 'Ngày 2: Làng gốm Thanh Hà', 'Thăm làng gốm, rừng dừa Bảy Mẫu.', 'tour-013'),
('iti-014-d1', 1, 'Ngày 1: Gành Đá Đĩa', 'Thăm Gành Đá Đĩa, Bãi Xép.', 'tour-014'),
('iti-014-d2', 2, 'Ngày 2: Mũi Điện', 'Đón bình minh Mũi Điện, Hải đăng.', 'tour-014'),
('iti-015-d1', 1, 'Ngày 1: VinWonders', 'Vui chơi tại VinWonders Nha Trang.', 'tour-015'),
('iti-015-d2', 2, 'Ngày 2: Tour 4 đảo', 'Lặn ngắm san hô, tour 4 đảo.', 'tour-015'),
('iti-016-d1', 1, 'Ngày 1: Hồ Xuân Hương', 'Dạo Hồ Xuân Hương, Chợ đêm Đà Lạt.', 'tour-016'),
('iti-016-d2', 2, 'Ngày 2: Săn mây Cầu Đất', 'Săn mây, đồi chè Cầu Đất.', 'tour-016'),
('iti-017-d1', 1, 'Ngày 1: Động Phong Nha', 'Du thuyền sông Son, thăm Động Phong Nha.', 'tour-017'),
('iti-017-d2', 2, 'Ngày 2: Động Thiên Đường', 'Khám phá Động Thiên Đường, suối Moọc.', 'tour-017'),
('iti-018-d1', 1, 'Ngày 1: Eo Gió', 'Ngắm hoàng hôn Eo Gió, Tịnh xá Ngọc Hòa.', 'tour-018'),
('iti-018-d2', 2, 'Ngày 2: Kỳ Co', 'Tắm biển Kỳ Co, lặn ngắm san hô.', 'tour-018'),
('iti-019-d1', 1, 'Ngày 1: Làng Sen', 'Thăm Làng Sen, Làng Hoàng Trù quê Bác.', 'tour-019'),
('iti-019-d2', 2, 'Ngày 2: Biển Cửa Lò', 'Tắm biển Cửa Lò.', 'tour-019'),
('iti-020-d1', 1, 'Ngày 1: Thành cổ Quảng Trị', 'Thăm Thành cổ, nghĩa trang Trường Sơn.', 'tour-020'),
('iti-020-d2', 2, 'Ngày 2: DMZ', 'Cầu Hiền Lương, sông Bến Hải, địa đạo Vịnh Mốc.', 'tour-020'),
('iti-021-d1', 1, 'Ngày 1: Dinh Độc Lập', 'Thăm Dinh Độc Lập, Nhà thờ Đức Bà.', 'tour-021'),
('iti-021-d2', 2, 'Ngày 2: Chợ Bến Thành', 'Mua sắm Chợ Bến Thành, Bưu điện Thành phố.', 'tour-021'),
('iti-022-d1', 1, 'Ngày 1: Grand World', 'Khám phá Grand World, Safari Phú Quốc.', 'tour-022'),
('iti-022-d2', 2, 'Ngày 2: Cáp treo Hòn Thơm', 'Đi cáp treo, tắm biển Hòn Thơm.', 'tour-022'),
('iti-023-d1', 1, 'Ngày 1: Bến Ninh Kiều', 'Dạo bến Ninh Kiều, ăn tối du thuyền.', 'tour-023'),
('iti-023-d2', 2, 'Ngày 2: Chợ nổi Cái Răng', 'Sáng sớm đi Chợ nổi, lò hủ tiếu.', 'tour-023'),
('iti-024-d1', 1, 'Ngày 1: Xứ Dừa', 'Đi thuyền rạch dừa, lò kẹo dừa, miệt vườn.', 'tour-024'),
('iti-024-d2', 2, 'Ngày 2: Cồn Phụng', 'Khám phá Cồn Phụng (nếu là tour 2N)', 'tour-024'),
('iti-025-d1', 1, 'Ngày 1: Bãi Sau', 'Tắm biển Bãi Sau, ăn hải sản.', 'tour-025'),
('iti-025-d2', 2, 'Ngày 2: Tượng Chúa Kito', 'Leo Tượng Chúa, ngắm thành phố.', 'tour-025'),
('iti-026-d1', 1, 'Ngày 1: Đồng sen', 'Du thuyền ngắm đồng sen Tháp Mười.', 'tour-026'),
('iti-026-d2', 2, 'Ngày 2: Tràm Chim', 'Khám phá VQG Tràm Chim.', 'tour-026'),
('iti-027-d1', 1, 'Ngày 1: Núi Sam', 'Viếng Miếu Bà Chúa Xứ Núi Sam.', 'tour-027'),
('iti-027-d2', 2, 'Ngày 2: Rừng tràm Trà Sư', 'Đi thuyền rừng tràm Trà Sư.', 'tour-027'),
('iti-028-d1', 1, 'Ngày 1: Núi Bà Đen', 'Đi cáp treo Núi Bà Đen, Tòa Thánh.', 'tour-028'),
('iti-028-d2', 2, 'Ngày 2: (Tour 1 ngày)', 'Kết thúc tour', 'tour-028'),
('iti-029-d1', 1, 'Ngày 1: Đất Mũi', 'Đi cano, chạm mốc Cực Nam.', 'tour-029'),
('iti-029-d2', 2, 'Ngày 2: Rừng ngập mặn', 'Khám phá rừng ngập mặn Cà Mau.', 'tour-029'),
('iti-030-d1', 1, 'Ngày 1: Nhà Công tử Bạc Liêu', 'Thăm nhà Công tử Bạc Liêu, điện gió.', 'tour-030'),
('iti-030-d2', 2, 'Ngày 2: Nhà hát Cao Văn Lầu', 'Check-in nhà hát "3 nón lá".', 'tour-030');


-- =================================================================
-- 8. Báº¢NG TÆ¯Æ NG TÃC (Reviews, Favorites, Contact)
-- =================================================================

-- Reviews (60 dÃ²ng - 2 review / tour - Táº¥t cáº£ 4-5 sao)
INSERT INTO reviews (reviewid, rating, comment, created_at, status, user_id, tour_id) VALUES
('rev-001-a', 5, 'Tour Hà Nội (tour-001) rất tuyệt vời, HDV am hiểu, ẩm thực ngon.', '2025-05-01 10:30:00', 'APPROVED', 'user-cust-001', 'tour-001'),
('rev-001-b', 4, 'Tour Hà Nội (tour-001) ổn, khách sạn tốt, lịch trình hơi vội.', '2025-05-02 11:00:00', 'APPROVED', 'user-cust-002', 'tour-001'),
('rev-002-a', 5, 'Du thuyền Hạ Long (tour-002) 5 sao, dịch vụ hoàn hảo, cảnh đẹp.', '2025-06-01 14:00:00', 'APPROVED', 'user-cust-003', 'tour-002'),
('rev-002-b', 5, 'Rất hài lòng với tour Hạ Long (tour-002), chèo kayak rất vui.', '2025-06-02 15:00:00', 'APPROVED', 'user-cust-004', 'tour-002'),
('rev-003-a', 5, 'Chinh phục Fansipan (tour-003) là trải nghiệm đáng nhớ. 5 sao!', '2025-10-01 09:00:00', 'APPROVED', 'user-cust-005', 'tour-003'),
('rev-003-b', 4, 'Tour Sapa (tour-003) đẹp, nhưng hơi lạnh. HDV nhiệt tình.', '2025-10-02 10:00:00', 'APPROVED', 'user-cust-006', 'tour-003'),
('rev-004-a', 5, 'Ninh Bình (tour-004) đẹp như tranh, Tràng An tuyệt vời.', '2025-05-10 12:00:00', 'APPROVED', 'user-cust-007', 'tour-004'),
('rev-004-b', 5, 'Rất thích tour Ninh Bình (tour-004), leo Hang Múa hơi mệt nhưng xứng đáng.', '2025-05-11 13:00:00', 'APPROVED', 'user-cust-008', 'tour-004'),
('rev-005-a', 4, 'Mộc Châu (tour-005) không khí trong lành, đồi chè đẹp.', '2025-11-20 16:00:00', 'APPROVED', 'user-cust-009', 'tour-005'),
('rev-005-b', 5, 'Tour Mộc Châu (tour-005) 5 sao, đúng mùa hoa cải rất đẹp.', '2025-11-21 17:00:00', 'APPROVED', 'user-cust-010', 'tour-005'),
('rev-006-a', 5, 'Hà Giang (tour-006) hùng vĩ, mạo hiểm nhưng rất đáng đi.', '2025-11-01 18:00:00', 'APPROVED', 'user-cust-011', 'tour-006'),
('rev-006-b', 5, '5 sao cho tour Hà Giang (tour-006), anh lái xe cẩn thận, HDV vui tính.', '2025-11-02 19:00:00', 'APPROVED', 'user-cust-012', 'tour-006'),
('rev-007-a', 4, 'Cát Bà (tour-007) Vịnh Lan Hạ đẹp, đồ ăn hải sản tươi.', '2025-06-15 14:00:00', 'APPROVED', 'user-cust-013', 'tour-007'),
('rev-007-b', 5, 'Tour Cát Bà (tour-007) rất vui, chèo kayak thích, bãi tắm đẹp.', '2025-06-16 15:00:00', 'APPROVED', 'user-cust-014', 'tour-007'),
('rev-008-a', 5, 'Mai Châu (tour-008) yên bình, người dân thân thiện, trải nghiệm tốt.', '2025-05-20 10:00:00', 'APPROVED', 'user-cust-015', 'tour-008'),
('rev-008-b', 4, 'Tour Mai Châu (tour-008) 4 sao, đồ ăn ngon, nhà sàn sạch sẽ.', '2025-05-21 11:00:00', 'APPROVED', 'user-cust-016', 'tour-008'),
('rev-009-a', 5, 'Đi Yên Tử (tour-009) cảm thấy rất thanh tịnh, dịch vụ cáp treo tốt.', '2025-03-20 09:00:00', 'APPROVED', 'user-cust-017', 'tour-009'),
('rev-009-b', 4, 'Tour Yên Tử (tour-009) phù hợp cho người lớn tuổi, cảnh đẹp.', '2025-03-21 10:00:00', 'APPROVED', 'user-cust-018', 'tour-009'),
('rev-010-a', 4, 'Ba Vì (tour-010) đi 1 ngày là hợp lý, không khí trong lành.', '2025-04-25 14:00:00', 'APPROVED', 'user-cust-019', 'tour-010'),
('rev-010-b', 4, 'Tour Ba Vì (tour-010) 4 sao, nhà thờ cổ đẹp, đồ ăn ổn.', '2025-04-26 15:00:00', 'APPROVED', 'user-cust-020', 'tour-010'),
('rev-011-a', 5, 'Huế (tour-011) cổ kính, lãng mạn. Rất thích tour này.', '2025-05-15 10:00:00', 'APPROVED', 'user-cust-021', 'tour-011'),
('rev-011-b', 5, '5 sao cho tour Huế (tour-011). Ẩm thực Huế tuyệt vời.', '2025-05-16 11:00:00', 'APPROVED', 'user-cust-022', 'tour-011'),
('rev-012-a', 5, 'Đà Nẵng (tour-012) xứng đáng là thành phố đáng sống, tour rất tốt.', '2025-06-20 14:00:00', 'APPROVED', 'user-cust-023', 'tour-012'),
('rev-012-b', 4, 'Tour Đà Nẵng (tour-012) 4 sao, Bà Nà Hills đông nhưng đẹp.', '2025-06-21 15:00:00', 'APPROVED', 'user-cust-024', 'tour-012'),
('rev-013-a', 5, 'Hội An (tour-013) về đêm quá đẹp. Dịch vụ tour tốt.', '2025-05-25 10:00:00', 'APPROVED', 'user-cust-025', 'tour-013'),
('rev-013-b', 5, 'Tour Hội An (tour-013) 5 sao, thả hoa đăng rất lãng mạn.', '2025-05-26 11:00:00', 'APPROVED', 'user-cust-026', 'tour-013'),
('rev-014-a', 5, 'Phú Yên (tour-014) đẹp mê hồn, Gành Đá Đĩa rất kỳ vĩ.', '2025-07-10 14:00:00', 'APPROVED', 'user-cust-027', 'tour-014'),
('rev-014-b', 4, 'Tour Phú Yên (tour-014) 4 sao, đồ ăn ngon, biển đẹp.', '2025-07-11 15:00:00', 'APPROVED', 'user-cust-028', 'tour-014'),
('rev-015-a', 5, 'Nha Trang (tour-015) 5 sao, VinWonders chơi rất vui.', '2025-06-25 10:00:00', 'APPROVED', 'user-cust-029', 'tour-015'),
('rev-015-b', 4, 'Tour Nha Trang (tour-015) 4 sao, biển trong xanh, lặn san hô đẹp.', '2025-06-26 11:00:00', 'APPROVED', 'user-cust-030', 'tour-015'),
('rev-016-a', 5, 'Đà Lạt (tour-016) không bao giờ làm mình thất vọng. Tour săn mây tốt.', '2025-09-01 14:00:00', 'APPROVED', 'user-cust-001', 'tour-016'),
('rev-016-b', 5, 'Tour Đà Lạt (tour-016) 5 sao, không khí se lạnh, đồ ăn đêm ngon.', '2025-09-02 15:00:00', 'APPROVED', 'user-cust-002', 'tour-016'),
('rev-017-a', 5, 'Quảng Bình (tour-017) 5 sao, Động Thiên Đường quá đẹp, quá choáng ngợp.', '2025-07-20 10:00:00', 'APPROVED', 'user-cust-003', 'tour-017'),
('rev-017-b', 4, 'Tour Quảng Bình (tour-017) 4 sao, suối Moọc tắm mát, vui.', '2025-07-21 11:00:00', 'APPROVED', 'user-cust-004', 'tour-017'),
('rev-018-a', 5, 'Kỳ Co - Eo Gió (tour-018) đẹp không khác gì Maldives. 5 sao.', '2025-07-01 14:00:00', 'APPROVED', 'user-cust-005', 'tour-018'),
('rev-018-b', 5, 'Rất thích tour Bình Định (tour-018), hải sản rẻ và tươi.', '2025-07-02 15:00:00', 'APPROVED', 'user-cust-006', 'tour-018'),
('rev-019-a', 4, 'Về thăm quê Bác (tour-019) rất ý nghĩa. Tour tổ chức chu đáo.', '2025-05-30 10:00:00', 'APPROVED', 'user-cust-007', 'tour-019'),
('rev-019-b', 4, 'Tour Nghệ An (tour-019) 4 sao, biển Cửa Lò ổn.', '2025-05-31 11:00:00', 'APPROVED', 'user-cust-008', 'tour-019'),
('rev-020-a', 5, 'Hành trình DMZ (tour-020) rất xúc động, nghe kể chuyện lịch sử hay.', '2025-05-10 14:00:00', 'APPROVED', 'user-cust-009', 'tour-020'),
('rev-020-b', 4, 'Tour Quảng Trị (tour-020) 4 sao, nên đi một lần để biết lịch sử.', '2025-05-11 15:00:00', 'APPROVED', 'user-cust-010', 'tour-020'),
('rev-021-a', 4, 'Tour Sài Gòn (tour-021) 4 sao, đi qua các điểm chính, HDV tốt.', '2025-04-01 10:00:00', 'APPROVED', 'user-cust-011', 'tour-021'),
('rev-021-b', 4, 'Tham quan TP.HCM (tour-021) trong 2 ngày là hợp lý, tour ổn.', '2025-04-02 11:00:00', 'APPROVED', 'user-cust-012', 'tour-021'),
('rev-022-a', 5, 'Phú Quốc (tour-022) 5 sao. Resort đẹp, Grand World và Safari tuyệt vời.', '2025-07-15 14:00:00', 'APPROVED', 'user-cust-013', 'tour-022'),
('rev-022-b', 5, 'Rất hài lòng tour Phú Quốc (tour-022), cáp treo Hòn Thơm cảnh đẹp.', '2025-07-16 15:00:00', 'APPROVED', 'user-cust-014', 'tour-022'),
('rev-023-a', 5, 'Cần Thơ (tour-023) 5 sao, đi chợ nổi rất thú vị, đồ ăn ngon.', '2025-05-15 10:00:00', 'APPROVED', 'user-cust-015', 'tour-023'),
('rev-023-b', 4, 'Tour Cần Thơ (tour-023) 4 sao, bến Ninh Kiều buổi tối đẹp.', '2025-05-16 11:00:00', 'APPROVED', 'user-cust-016', 'tour-023'),
('rev-024-a', 4, 'Tour Bến Tre (tour-024) 1 ngày vui, ăn trái cây, nghe đờn ca tài tử.', '2025-04-20 14:00:00', 'APPROVED', 'user-cust-017', 'tour-024'),
('rev-024-b', 4, 'Trải nghiệm xứ dừa (tour-024) thú vị, kẹo dừa ngon.', '2025-04-21 15:00:00', 'APPROVED', 'user-cust-018', 'tour-024'),
('rev-025-a', 4, 'Vũng Tàu (tour-025) 4 sao, biển gần Sài Gòn, đi cuối tuần hợp lý.', '2025-06-01 10:00:00', 'APPROVED', 'user-cust-019', 'tour-025'),
('rev-025-b', 4, 'Tour Vũng Tàu (tour-025) tốt, hải sản tươi.', '2025-06-02 11:00:00', 'APPROVED', 'user-cust-020', 'tour-025'),
('rev-026-a', 5, 'Đồng Tháp (tour-026) 5 sao, đồng sen rất đẹp, yên bình.', '2025-08-20 14:00:00', 'APPROVED', 'user-cust-021', 'tour-026'),
('rev-026-b', 4, 'Tour Đồng Tháp (tour-026) 4 sao, Tràm Chim mùa nước nổi đẹp.', '2025-08-21 15:00:00', 'APPROVED', 'user-cust-022', 'tour-026'),
('rev-027-a', 5, 'An Giang (tour-027) 5 sao, rừng tràm Trà Sư quá ấn tượng.', '2025-09-10 10:00:00', 'APPROVED', 'user-cust-023', 'tour-027'),
('rev-027-b', 5, 'Miếu Bà linh thiêng, tour An Giang (tour-027) rất tốt.', '2025-09-11 11:00:00', 'APPROVED', 'user-cust-024', 'tour-027'),
('rev-028-a', 4, 'Tây Ninh (tour-028) 1 ngày đi Núi Bà Đen ok, cáp treo nhanh.', '2025-04-10 14:00:00', 'APPROVED', 'user-cust-025', 'tour-028'),
('rev-028-b', 4, 'Tour Tây Ninh (tour-028) 4 sao, Tòa Thánh kiến trúc đẹp.', '2025-04-11 15:00:00', 'APPROVED', 'user-cust-026', 'tour-028'),
('rev-029-a', 5, 'Cà Mau (tour-029) 5 sao, chạm mốc Cực Nam rất ý nghĩa.', '2025-10-20 10:00:00', 'APPROVED', 'user-cust-027', 'tour-029'),
('rev-029-b', 4, 'Tour Cà Mau (tour-029) 4 sao, đi cano xuyên rừng vui.', '2025-10-21 11:00:00', 'APPROVED', 'user-cust-028', 'tour-029'),
('rev-030-a', 5, 'Bạc Liêu (tour-030) 5 sao, nhà Công tử Bạc Liêu rất thú vị.', '2025-08-15 14:00:00', 'APPROVED', 'user-cust-029', 'tour-030'),
('rev-030-b', 4, 'Tour Bạc Liêu (tour-030) 4 sao, cánh đồng điện gió check-in đẹp.', '2025-08-16 15:00:00', 'APPROVED', 'user-cust-030', 'tour-030');

-- Favorites (30 dÃ²ng - Má»—i user 1 tour yÃªu thÃ­ch)
INSERT INTO favorites (favoriteid, added_at, user_id, tour_id) VALUES
('fav-001', CURRENT_TIMESTAMP, 'user-cust-001', 'tour-003'), ('fav-002', CURRENT_TIMESTAMP, 'user-cust-002', 'tour-002'),
('fav-003', CURRENT_TIMESTAMP, 'user-cust-003', 'tour-022'), ('fav-004', CURRENT_TIMESTAMP, 'user-cust-004', 'tour-013'),
('fav-005', CURRENT_TIMESTAMP, 'user-cust-005', 'tour-025'), ('fav-006', CURRENT_TIMESTAMP, 'user-cust-006', 'tour-021'),
('fav-007', CURRENT_TIMESTAMP, 'user-cust-007', 'tour-001'), ('fav-008', CURRENT_TIMESTAMP, 'user-cust-008', 'tour-012'),
('fav-009', CURRENT_TIMESTAMP, 'user-cust-009', 'tour-023'), ('fav-010', CURRENT_TIMESTAMP, 'user-cust-010', 'tour-024'),
('fav-011', CURRENT_TIMESTAMP, 'user-cust-011', 'tour-006'), ('fav-012', CURRENT_TIMESTAMP, 'user-cust-012', 'tour-018'),
('fav-013', CURRENT_TIMESTAMP, 'user-cust-013', 'tour-011'), ('fav-014', CURRENT_TIMESTAMP, 'user-cust-014', 'tour-016'),
('fav-015', CURRENT_TIMESTAMP, 'user-cust-015', 'tour-008'), ('fav-016', CURRENT_TIMESTAMP, 'user-cust-016', 'tour-015'),
('fav-017', CURRENT_TIMESTAMP, 'user-cust-017', 'tour-014'), ('fav-018', CURRENT_TIMESTAMP, 'user-cust-018', 'tour-004'),
('fav-019', CURRENT_TIMESTAMP, 'user-cust-019', 'tour-005'), ('fav-020', CURRENT_TIMESTAMP, 'user-cust-020', 'tour-007'),
('fav-021', CURRENT_TIMESTAMP, 'user-cust-021', 'tour-009'), ('fav-022', CURRENT_TIMESTAMP, 'user-cust-022', 'tour-010'),
('fav-023', CURRENT_TIMESTAMP, 'user-cust-023', 'tour-017'), ('fav-024', CURRENT_TIMESTAMP, 'user-cust-024', 'tour-019'),
('fav-025', CURRENT_TIMESTAMP, 'user-cust-025', 'tour-020'), ('fav-026', CURRENT_TIMESTAMP, 'user-cust-026', 'tour-026'),
('fav-027', CURRENT_TIMESTAMP, 'user-cust-027', 'tour-027'), ('fav-028', CURRENT_TIMESTAMP, 'user-cust-028', 'tour-028'),
('fav-029', CURRENT_TIMESTAMP, 'user-cust-029', 'tour-029'), ('fav-030', CURRENT_TIMESTAMP, 'user-cust-030', 'tour-030');

-- ContactMessages (30 dÃ²ng)
INSERT INTO contact_messages (contact_messid, email, phone, message, sent_at, user_id) VALUES
('msg-001', 'guest1@example.com', '0123456701', 'Tôi muốn hỏi về tour Hạ Long (tour-002) cho đoàn 30 người?', CURRENT_TIMESTAMP, NULL),
('msg-002', 'nguyenvanan@gmail.com', '0987654321', 'Tôi muốn hủy tour Sapa (tour-003) đã đặt ngày 20/12.', CURRENT_TIMESTAMP, 'user-cust-001'),
('msg-003', 'guest2@example.com', '0123456702', 'Tour Hà Giang (tour-006) có an toàn không?', CURRENT_TIMESTAMP, NULL),
('msg-004', 'guest3@example.com', '0123456703', 'Trẻ em 5 tuổi tour Phú Quốc (tour-022) giá bao nhiêu?', CURRENT_TIMESTAMP, NULL),
('msg-005', 'tranbinh@gmail.com', '0912345678', 'Tour Đà Nẵng (tour-012) có bao gồm vé Bà Nà không?', CURRENT_TIMESTAMP, 'user-cust-002'),
('msg-006', 'guest4@example.com', '0123456704', 'Tôi muốn đặt tour riêng cho gia đình đi Đà Lạt (tour-016).', CURRENT_TIMESTAMP, NULL),
('msg-007', 'lecuong@outlook.com', '0905111222', 'Hỗ trợ check-in online giúp tôi.', CURRENT_TIMESTAMP, 'user-cust-003'),
('msg-008', 'guest5@example.com', '0123456705', 'Tour 1 ngày Bến Tre (tour-024) có đón ở Cần Thơ không?', CURRENT_TIMESTAMP, NULL),
('msg-009', 'guest6@example.com', '0123456706', 'Tôi muốn hỏi về tour (tour-017) Quảng Bình.', CURRENT_TIMESTAMP, NULL),
('msg-010', 'phamduyen@yahoo.com', '0978999888', 'Gửi cho tôi cẩm nang du lịch Huế (tour-011).', CURRENT_TIMESTAMP, 'user-cust-004'),
('msg-011', 'guest7@example.com', '0123456707', 'Cần tư vấn tour (tour-018) Quy Nhơn.', CURRENT_TIMESTAMP, NULL),
('msg-012', 'guest8@example.com', '0123456708', 'Tour (tour-027) An Giang có đi Châu Đốc không?', CURRENT_TIMESTAMP, NULL),
('msg-013', 'vothanhe@gmail.com', '0905111333', 'Tour (tour-025) Vũng Tàu có khởi hành hàng ngày không?', CURRENT_TIMESTAMP, 'user-cust-005'),
('msg-014', 'guest9@example.com', '0123456709', 'Tôi muốn biết về tour (tour-028) Tây Ninh.', CURRENT_TIMESTAMP, NULL),
('msg-015', 'guest10@example.com', '0123456710', 'Tour (tour-004) Ninh Bình có ăn chay được không?', CURRENT_TIMESTAMP, NULL),
('msg-016', 'danggkim@gmail.com', '0905111444', 'Tôi muốn đổi ngày tour (tour-021) TP.HCM.', CURRENT_TIMESTAMP, 'user-cust-006'),
('msg-017', 'guest11@example.com', '0123456711', 'Tour (tour-005) Mộc Châu tháng 12 có hoa gì?', CURRENT_TIMESTAMP, NULL),
('msg-018', 'hoangvanh@gmail.com', '0905111555', 'Tour (tour-001) Hà Nội có xuất hóa đơn VAT không?', CURRENT_TIMESTAMP, 'user-cust-007'),
('msg-019', 'guest12@example.com', '0123456712', 'Tôi muốn hỏi về tour (tour-007) Cát Bà.', CURRENT_TIMESTAMP, NULL),
('msg-020', 'trinhthii@gmail.com', '0905111666', 'Góp ý: website nên thêm bộ lọc giá.', CURRENT_TIMESTAMP, 'user-cust-008'),
('msg-021', 'guest13@example.com', '0123456713', 'Tour (tour-008) Mai Châu có đốt lửa trại không?', CURRENT_TIMESTAMP, NULL),
('msg-022', 'lyminhk@gmail.com', '0905111777', 'Tôi muốn hỏi về (tour-023) Cần Thơ.', CURRENT_TIMESTAMP, 'user-cust-009'),
('msg-023', 'guest14@example.com', '0123456714', 'Tour (tour-009) Yên Tử có cần leo bộ nhiều không?', CURRENT_TIMESTAMP, NULL),
('msg-024', 'buivanl@gmail.com', '0905111888', 'Tôi muốn hỏi về (tour-024) Bến Tre.', CURRENT_TIMESTAMP, 'user-cust-010'),
('msg-025', 'guest15@example.com', '0123456715', 'Tour (tour-010) Ba Vì có đi trong ngày không?', CURRENT_TIMESTAMP, NULL),
('msg-026', 'ngothim@gmail.com', '0905111999', 'Gửi tôi thông tin (tour-011) Huế.', CURRENT_TIMESTAMP, 'user-cust-011'),
('msg-027', 'guest16@example.com', '0123456716', 'Tour (tour-013) Hội An có bao gồm ăn tối không?', CURRENT_TIMESTAMP, NULL),
('msg-028', 'duongvann@gmail.com', '0905222111', 'Tôi muốn hỏi (tour-012) Đà Nẵng.', CURRENT_TIMESTAMP, 'user-cust-012'),
('msg-029', 'guest17@example.com', '0123456717', 'Tour (tour-014) Phú Yên có đi Gành Đá Đĩa không?', CURRENT_TIMESTAMP, NULL),
('msg-030', 'phanthio@gmail.com', '0905222222', 'Tôi muốn hỏi (tour-015) Nha Trang.', CURRENT_TIMESTAMP, 'user-cust-013');


-- =================================================================
-- 9. CHUá»–I BOOKING (30 bookings)
-- =================================================================

-- Bookings (30 dÃ²ng - Má»—i user Ä‘áº·t 1 tour)
-- Bookings (30 dÃ²ng - Má»—i user Ä‘áº·t 1 tour)
INSERT INTO bookings (bookingid, booking_date, num_adults, num_children, total_price, discount_amount, final_amount, status, customer_id, tour_id, promotion_id) VALUES
('bkg-001', '2025-03-01 08:00:00', 2, 0, 4400000, 440000, 3960000, 'COMPLETED', 'user-cust-001', 'tour-001', 'promo-001'),
('bkg-002', '2025-04-01 09:00:00', 1, 1, 4890000, 150000, 4740000, 'COMPLETED', 'user-cust-002', 'tour-002', 'promo-002'),
('bkg-003', '2025-08-01 10:00:00', 2, 0, 7000000, 1050000, 5950000, 'COMPLETED', 'user-cust-003', 'tour-003', 'promo-003'),
('bkg-004', '2025-03-10 11:00:00', 1, 0, 2100000, 210000, 1890000, 'COMPLETED', 'user-cust-004', 'tour-004', 'promo-004'),
('bkg-005', '2025-10-01 12:00:00', 2, 1, 5100000, 200000, 4900000, 'COMPLETED', 'user-cust-005', 'tour-005', 'promo-005'),
('bkg-006', '2025-09-01 13:00:00', 1, 0, 4800000, 480000, 4320000, 'COMPLETED', 'user-cust-006', 'tour-006', 'promo-006'),
('bkg-007', '2025-05-01 14:00:00', 2, 2, 10800000, 540000, 10260000, 'COMPLETED', 'user-cust-007', 'tour-007', 'promo-007'),
('bkg-008', '2025-04-01 15:00:00', 2, 0, 3500000, 245000, 3255000, 'CONFIRMED', 'user-cust-008', 'tour-008', 'promo-008'),
('bkg-009', '2025-02-01 16:00:00', 1, 0, 2000000, 300000, 1700000, 'COMPLETED', 'user-cust-009', 'tour-009', 'promo-009'),
('bkg-010', '2025-03-01 17:00:00', 4, 0, 3200000, 384000, 2816000, 'CANCELED', 'user-cust-010', 'tour-010', 'promo-010'),
('bkg-011', '2025-03-15 08:00:00', 2, 0, 7200000, 720000, 6480000, 'COMPLETED', 'user-cust-011', 'tour-011', 'promo-011'),
('bkg-012', '2025-05-01 09:00:00', 2, 1, 10400000, 1040000, 9360000, 'COMPLETED', 'user-cust-012', 'tour-012', 'promo-012'),
('bkg-013', '2025-04-10 10:00:00', 2, 0, 3900000, 390000, 3510000, 'COMPLETED', 'user-cust-013', 'tour-013', 'promo-013'),
('bkg-014', '2025-06-01 11:00:00', 1, 0, 4100000, 410000, 3690000, 'COMPLETED', 'user-cust-014', 'tour-014', 'promo-014'),
('bkg-015', '2025-05-15 12:00:00', 2, 0, 6600000, 660000, 5940000, 'COMPLETED', 'user-cust-015', 'tour-015', 'promo-015'),
('bkg-016', '2025-07-01 13:00:00', 2, 0, 5800000, 200000, 5600000, 'COMPLETED', 'user-cust-016', 'tour-016', 'promo-016'),
('bkg-017', '2025-06-10 14:00:00', 1, 0, 4500000, 200000, 4300000, 'CONFIRMED', 'user-cust-017', 'tour-017', 'promo-017'),
('bkg-018', '2025-05-20 15:00:00', 2, 0, 7800000, 200000, 7600000, 'COMPLETED', 'user-cust-018', 'tour-018', 'promo-018'),
('bkg-019', '2025-04-18 16:00:00', 2, 1, 6200000, 200000, 6000000, 'COMPLETED', 'user-cust-019', 'tour-019', 'promo-019'),
('bkg-020', '2025-03-29 17:00:00', 1, 0, 2500000, 200000, 2300000, 'COMPLETED', 'user-cust-020', 'tour-020', 'promo-020'),
('bkg-021', '2025-02-20 08:00:00', 2, 0, 4800000, 150000, 4650000, 'COMPLETED', 'user-cust-021', 'tour-021', 'promo-021'),
('bkg-022', '2025-06-05 09:00:00', 2, 1, 12200000, 150000, 12050000, 'COMPLETED', 'user-cust-022', 'tour-022', 'promo-022'),
('bkg-023', '2025-04-05 10:00:00', 2, 0, 3600000, 150000, 3450000, 'COMPLETED', 'user-cust-023', 'tour-023', 'promo-023'),
('bkg-024', '2025-03-12 11:00:00', 4, 0, 3000000, 150000, 2850000, 'COMPLETED', 'user-cust-024', 'tour-024', 'promo-024'),
('bkg-025', '2025-04-24 12:00:00', 2, 0, 3800000, 150000, 3650000, 'COMPLETED', 'user-cust-025', 'tour-025', 'promo-025'),
('bkg-026', '2025-07-10 13:00:00', 2, 0, 4000000, 150000, 3850000, 'COMPLETED', 'user-cust-026', 'tour-026', 'promo-026'),
('bkg-027', '2025-08-01 14:00:00', 1, 0, 3100000, 150000, 2950000, 'COMPLETED', 'user-cust-027', 'tour-027', 'promo-027'),
('bkg-028', '2025-02-28 15:00:00', 2, 0, 1700000, 150000, 1550000, 'COMPLETED', 'user-cust-028', 'tour-028', 'promo-028'),
('bkg-029', '2025-09-10 16:00:00', 1, 1, 4500000, 150000, 4350000, 'COMPLETED', 'user-cust-029', 'tour-029', 'promo-029'),
('bkg-030', '2025-07-05 17:00:00', 2, 0, 4800000, 150000, 4650000, 'COMPLETED', 'user-cust-030', 'tour-030', 'promo-030');
-- Participants (60 dÃ²ng - 2 ngÆ°á»i / booking)
INSERT INTO participants (participantid, customer_name, customer_phone, identification, gender, participant_type, booking_id) VALUES
('part-001-a', 'Nguyễn Văn An', '0987654321', '0123456789', 'MALE', 'ADULT', 'bkg-001'),
('part-001-b', 'Trần Thu A', '0987654321', '0123456790', 'FEMALE', 'ADULT', 'bkg-001'),
('part-002-a', 'Trần Thị Bình', '0912345678', '0234567890', 'FEMALE', 'ADULT', 'bkg-002'),
('part-002-b', 'Trần Bé B', '', '', 'MALE', 'CHILD', 'bkg-002'),
('part-003-a', 'Lê Minh Cường', '0905111222', '0345678901', 'MALE', 'ADULT', 'bkg-003'),
('part-003-b', 'Phan Thị C', '0905111222', '0345678902', 'FEMALE', 'ADULT', 'bkg-003'),
('part-004-a', 'Phạm Hồng Duyên', '0978999888', '0456789012', 'FEMALE', 'ADULT', 'bkg-004'),
('part-004-b', 'Phạm Văn D', '0978999888', '0456789013', 'MALE', 'ADULT', 'bkg-004'),
('part-005-a', 'Võ Thanh E', '0905111333', '0567890123', 'MALE', 'ADULT', 'bkg-005'),
('part-005-b', 'Võ Thị E', '0905111333', '0567890124', 'FEMALE', 'ADULT', 'bkg-005'),
('part-006-a', 'Đặng Kim G', '0905111444', '0678901234', 'FEMALE', 'ADULT', 'bkg-006'),
('part-006-b', 'Đặng Bé G', '', '', 'MALE', 'CHILD', 'bkg-006'),
('part-007-a', 'Hoàng Văn H', '0905111555', '0789012345', 'MALE', 'ADULT', 'bkg-007'),
('part-007-b', 'Hoàng Thị H', '0905111555', '0789012346', 'FEMALE', 'ADULT', 'bkg-007'),
('part-008-a', 'Trịnh Thị I', '0905111666', '0890123456', 'FEMALE', 'ADULT', 'bkg-008'),
('part-008-b', 'Trịnh Bé I', '', '', 'FEMALE', 'CHILD', 'bkg-008'),
('part-009-a', 'Lý Minh K', '0905111777', '0901234567', 'MALE', 'ADULT', 'bkg-009'),
('part-009-b', 'Lý Thị K', '0905111777', '0901234568', 'FEMALE', 'ADULT', 'bkg-009'),
('part-010-a', 'Bùi Văn L', '0905111888', '1012345678', 'MALE', 'ADULT', 'bkg-010'),
('part-010-b', 'Bùi Bé L', '', '', 'MALE', 'CHILD', 'bkg-010'),
('part-011-a', 'Ngô Thị M', '0905111999', '1123456789', 'FEMALE', 'ADULT', 'bkg-011'),
('part-011-b', 'Ngô Văn M', '0905111999', '1123456790', 'MALE', 'ADULT', 'bkg-011'),
('part-012-a', 'Dương Văn N', '0905222111', '1234567890', 'MALE', 'ADULT', 'bkg-012'),
('part-012-b', 'Dương Bé N', '', '', 'FEMALE', 'CHILD', 'bkg-012'),
('part-013-a', 'Phan Thị O', '0905222222', '1345678901', 'FEMALE', 'ADULT', 'bkg-013'),
('part-013-b', 'Phan Văn O', '0905222222', '1345678902', 'MALE', 'ADULT', 'bkg-013'),
('part-014-a', 'Mai Văn P', '0905222333', '1456789012', 'MALE', 'ADULT', 'bkg-014'),
('part-014-b', 'Mai Bé P', '', '', 'MALE', 'CHILD', 'bkg-014'),
('part-015-a', 'Huỳnh Thị Q', '0905222444', '1567890123', 'FEMALE', 'ADULT', 'bkg-015'),
('part-015-b', 'Huỳnh Văn Q', '0905222444', '1567890124', 'MALE', 'ADULT', 'bkg-015'),
('part-016-a', 'Lưu Văn R', '0905222555', '1678901234', 'MALE', 'ADULT', 'bkg-016'),
('part-016-b', 'Lưu Bé R', '', '', 'FEMALE', 'CHILD', 'bkg-016'),
('part-017-a', 'Tô Thị S', '0905222666', '1789012345', 'FEMALE', 'ADULT', 'bkg-017'),
('part-017-b', 'Tô Văn S', '0905222666', '1789012346', 'MALE', 'ADULT', 'bkg-017'),
('part-018-a', 'Đinh Văn T', '0905222777', '1890123456', 'MALE', 'ADULT', 'bkg-018'),
('part-018-b', 'Đinh Bé T', '', '', 'MALE', 'CHILD', 'bkg-018'),
('part-019-a', 'Chu Thị U', '0905222888', '1901234567', 'FEMALE', 'ADULT', 'bkg-019'),
('part-019-b', 'Chu Văn U', '0905222888', '1901234568', 'MALE', 'ADULT', 'bkg-019'),
('part-020-a', 'Vương Văn V', '0905222999', '2012345678', 'MALE', 'ADULT', 'bkg-020'),
('part-020-b', 'Vương Bé V', '', '', 'FEMALE', 'CHILD', 'bkg-020'),
('part-021-a', 'Mạc Thị X', '0905333111', '2123456789', 'FEMALE', 'ADULT', 'bkg-021'),
('part-021-b', 'Mạc Văn X', '0905333111', '2123456790', 'MALE', 'ADULT', 'bkg-021'),
('part-022-a', 'Đỗ Văn Y', '0905333222', '2234567890', 'MALE', 'ADULT', 'bkg-022'),
('part-022-b', 'Đỗ Bé Y', '', '', 'FEMALE', 'CHILD', 'bkg-022'),
('part-023-a', 'Giang Thị Z', '0905333333', '2345678901', 'FEMALE', 'ADULT', 'bkg-023'),
('part-023-b', 'Giang Văn Z', '0905333333', '2345678902', 'MALE', 'ADULT', 'bkg-023'),
('part-024-a', 'Trần Văn A1', '0905333444', '2456789012', 'MALE', 'ADULT', 'bkg-024'),
('part-024-b', 'Trần Bé A1', '', '', 'MALE', 'CHILD', 'bkg-024'),
('part-025-a', 'Lê Thị B2', '0905333555', '2567890123', 'FEMALE', 'ADULT', 'bkg-025'),
('part-025-b', 'Lê Văn B2', '0905333555', '2567890124', 'MALE', 'ADULT', 'bkg-025'),
('part-026-a', 'Phạm Văn C3', '0905333666', '2678901234', 'MALE', 'ADULT', 'bkg-026'),
('part-026-b', 'Phạm Bé C3', '', '', 'FEMALE', 'CHILD', 'bkg-026'),
('part-027-a', 'Nguyễn Thị D4', '0905333777', '2789012345', 'FEMALE', 'ADULT', 'bkg-027'),
('part-027-b', 'Nguyễn Văn D4', '0905333777', '2789012346', 'MALE', 'ADULT', 'bkg-027'),
('part-028-a', 'Võ Văn E5', '0905333888', '2890123456', 'MALE', 'ADULT', 'bkg-028'),
('part-028-b', 'Võ Bé E5', '', '', 'MALE', 'CHILD', 'bkg-028'),
('part-029-a', 'Đặng Thị F6', '0905333999', '2901234567', 'FEMALE', 'ADULT', 'bkg-029'),
('part-029-b', 'Đặng Văn F6', '0905333999', '2901234568', 'MALE', 'ADULT', 'bkg-029'),
('part-030-a', 'Hoàng Văn G7', '0905444111', '3012345678', 'MALE', 'ADULT', 'bkg-030'),
('part-030-b', 'Hoàng Bé G7', '', '', 'FEMALE', 'CHILD', 'bkg-030');


-- =================================================================
-- 10. Báº¢NG HÃ“A ÄÆ N VÃ€ THANH TOÃN
-- =================================================================

-- Invoices (29 dÃ²ng - bkg-010 CANCELED nÃªn khÃ´ng cÃ³ hÃ³a Ä‘Æ¡n)
INSERT INTO invoices (invoiceid, total_amount, tax_percentage, created_at, booking_id) VALUES
('inv-001', 3960000, 8, '2025-03-01 08:01:00', 'bkg-001'),
('inv-002', 4740000, 8, '2025-04-01 09:01:00', 'bkg-002'),
('inv-003', 5950000, 8, '2025-08-01 10:01:00', 'bkg-003'),
('inv-004', 1890000, 8, '2025-03-10 11:01:00', 'bkg-004'),
('inv-005', 4900000, 8, '2025-10-01 12:01:00', 'bkg-005'),
('inv-006', 4320000, 8, '2025-09-01 13:01:00', 'bkg-006'),
('inv-007', 10260000, 8, '2025-05-01 14:01:00', 'bkg-007'),
('inv-008', 3255000, 8, '2025-04-01 15:01:00', 'bkg-008'),
('inv-009', 1700000, 8, '2025-02-01 16:01:00', 'bkg-009'),
-- bkg-010 CANCELED
('inv-011', 6480000, 8, '2025-03-15 08:01:00', 'bkg-011'),
('inv-012', 9360000, 8, '2025-05-01 09:01:00', 'bkg-012'),
('inv-013', 3510000, 8, '2025-04-10 10:01:00', 'bkg-013'),
('inv-014', 3690000, 8, '2025-06-01 11:01:00', 'bkg-014'),
('inv-015', 5940000, 8, '2025-05-15 12:01:00', 'bkg-015'),
('inv-016', 5600000, 8, '2025-07-01 13:01:00', 'bkg-016'),
('inv-017', 4300000, 8, '2025-06-10 14:01:00', 'bkg-017'),
('inv-018', 7600000, 8, '2025-05-20 15:01:00', 'bkg-018'),
('inv-019', 6000000, 8, '2025-04-18 16:01:00', 'bkg-019'),
('inv-020', 2300000, 8, '2025-03-29 17:01:00', 'bkg-020'),
('inv-021', 4650000, 8, '2025-02-20 08:01:00', 'bkg-021'),
('inv-022', 12050000, 8, '2025-06-05 09:01:00', 'bkg-022'),
('inv-023', 3450000, 8, '2025-04-05 10:01:00', 'bkg-023'),
('inv-024', 2850000, 8, '2025-03-12 11:01:00', 'bkg-024'),
('inv-025', 3650000, 8, '2025-04-24 12:01:00', 'bkg-025'),
('inv-026', 3850000, 8, '2025-07-10 13:01:00', 'bkg-026'),
('inv-027', 2950000, 8, '2025-08-01 14:01:00', 'bkg-027'),
('inv-028', 1550000, 8, '2025-02-28 15:01:00', 'bkg-028'),
('inv-029', 4350000, 8, '2025-09-10 16:01:00', 'bkg-029'),
('inv-030', 4650000, 8, '2025-07-05 17:01:00', 'bkg-030');

-- Payments (29 dÃ²ng - 1 thanh toÃ¡n cho má»—i hÃ³a Ä‘Æ¡n)
INSERT INTO payments (paymentid, amount_paid, payment_date, status, payment_method, transaction_code, invoice_id) VALUES
('pay-001', 3960000, '2025-03-01 08:05:00', 'SUCCESS', 'VNPAY', 'VNP001', 'inv-001'),
('pay-002', 4740000, '2025-04-01 09:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC002', 'inv-002'),
('pay-003', 5950000, '2025-08-01 10:05:00', 'SUCCESS', 'VNPAY', 'VNP003', 'inv-003'),
('pay-004', 1890000, '2025-03-10 11:05:00', 'SUCCESS', 'VNPAY', 'VNP004', 'inv-004'),
('pay-005', 4900000, '2025-10-01 12:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC005', 'inv-005'),
('pay-006', 4320000, '2025-09-01 13:05:00', 'SUCCESS', 'VNPAY', 'VNP006', 'inv-006'),
('pay-007', 10260000, '2025-05-01 14:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC007', 'inv-007'),
('pay-008', 3255000, '2025-04-01 15:05:00', 'SUCCESS', 'VNPAY', 'VNP008', 'inv-008'),
('pay-009', 1700000, '2025-02-01 16:05:00', 'SUCCESS', 'VNPAY', 'VNP009', 'inv-009'),
-- bkg-010 CANCELED
('pay-011', 6480000, '2025-03-15 08:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC011', 'inv-011'),
('pay-012', 9360000, '2025-05-01 09:05:00', 'SUCCESS', 'VNPAY', 'VNP012', 'inv-012'),
('pay-013', 3510000, '2025-04-10 10:05:00', 'SUCCESS', 'VNPAY', 'VNP013', 'inv-013'),
('pay-014', 3690000, '2025-06-01 11:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC014', 'inv-014'),
('pay-015', 5940000, '2025-05-15 12:05:00', 'SUCCESS', 'VNPAY', 'VNP015', 'inv-015'),
('pay-016', 5600000, '2025-07-01 13:05:00', 'SUCCESS', 'VNPAY', 'VNP016', 'inv-016'),
('pay-017', 4300000, '2025-06-10 14:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC017', 'inv-017'),
('pay-018', 7600000, '2025-05-20 15:05:00', 'SUCCESS', 'VNPAY', 'VNP018', 'inv-018'),
('pay-019', 6000000, '2025-04-18 16:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC019', 'inv-019'),
('pay-020', 2300000, '2025-03-29 17:05:00', 'SUCCESS', 'VNPAY', 'VNP020', 'inv-020'),
('pay-021', 4650000, '2025-02-20 08:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC021', 'inv-021'),
('pay-022', 12050000, '2025-06-05 09:05:00', 'SUCCESS', 'VNPAY', 'VNP022', 'inv-022'),
('pay-023', 3450000, '2025-04-05 10:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC023', 'inv-023'),
('pay-024', 2850000, '2025-03-12 11:05:00', 'SUCCESS', 'VNPAY', 'VNP024', 'inv-024'),
('pay-025', 3650000, '2025-04-24 12:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC025', 'inv-025'),
('pay-026', 3850000, '2025-07-10 13:05:00', 'SUCCESS', 'VNPAY', 'VNP026', 'inv-026'),
('pay-027', 2950000, '2025-08-01 14:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC027', 'inv-027'),
('pay-028', 1550000, '2025-02-28 15:05:00', 'SUCCESS', 'VNPAY', 'VNP028', 'inv-028'),
('pay-029', 4350000, '2025-09-10 16:05:00', 'SUCCESS', 'CREDIT_CARD', 'CC029', 'inv-029'),
('pay-030', 4650000, '2025-07-05 17:05:00', 'SUCCESS', 'VNPAY', 'VNP030', 'inv-030');












--
-- -- XÃ“A Dá»® LIá»†U CÅ¨ TRÆ¯á»šC KHI THÃŠM Dá»® LIá»†U Má»šI
-- DELETE FROM payments;
-- DELETE FROM invoices;
-- DELETE FROM participants;
-- DELETE FROM bookings;
-- DELETE FROM reviews;
-- DELETE FROM favorites;
-- DELETE FROM contact_messages;
-- DELETE FROM tour_promotions;
-- DELETE FROM tour_destinations;
-- DELETE FROM itineraries;
-- DELETE FROM tour_images;
-- DELETE FROM images;
-- DELETE FROM accounts;
-- DELETE FROM users;
-- DELETE FROM tours;
-- DELETE FROM promotions;
-- DELETE FROM destinations;
-- DELETE FROM tour_types;

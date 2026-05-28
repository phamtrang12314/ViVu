-- Low-price tours for testing the bank-transfer payment flow.
-- Safe to run multiple times.

INSERT INTO tours (
    tourid, title, "description", start_date, end_date,
    duration_days, duration_nights, departure_place,
    price_adult, price_child, max_participants, min_participants,
    imageurl, status, ranking, tour_type_id
) VALUES
('tour-test-005k', '[TEST] Hà Nội mini tour 5K', 'Tour giá thấp dùng để kiểm thử thanh toán chuyển khoản.', '2026-06-01', '2026-06-01', 1, 0, 'Hà Nội', 5000, 5000, 20, 1, '/images/tours/hanoi_tour.webp', 'ACTIVE', 91, 'type-03'),
('tour-test-010k', '[TEST] Hạ Long mini tour 10K', 'Tour giá thấp dùng để kiểm thử thanh toán chuyển khoản.', '2026-06-02', '2026-06-02', 1, 0, 'Hà Nội', 10000, 10000, 20, 1, '/images/tours/halong_tour.jpg', 'ACTIVE', 92, 'type-01'),
('tour-test-015k', '[TEST] Sa Pa mini tour 15K', 'Tour giá thấp dùng để kiểm thử thanh toán chuyển khoản.', '2026-06-03', '2026-06-03', 1, 0, 'Hà Nội', 15000, 15000, 20, 1, '/images/tours/sapa_cover.jpg', 'ACTIVE', 93, 'type-02'),
('tour-test-100k', '[TEST] Đà Nẵng mini tour 100K', 'Tour giá thấp dùng để kiểm thử thanh toán chuyển khoản.', '2026-06-04', '2026-06-04', 1, 0, 'TP. Hồ Chí Minh', 100000, 100000, 20, 1, '/images/tours/danang_tour.jpg', 'ACTIVE', 94, 'type-01'),
('tour-test-150k', '[TEST] Phú Quốc mini tour 150K', 'Tour giá thấp dùng để kiểm thử thanh toán chuyển khoản.', '2026-06-05', '2026-06-05', 1, 0, 'TP. Hồ Chí Minh', 150000, 150000, 20, 1, '/images/tours/phuquoc_cover.jpg', 'ACTIVE', 95, 'type-01')
ON CONFLICT (tourid) DO UPDATE SET
    title = EXCLUDED.title,
    "description" = EXCLUDED."description",
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    duration_days = EXCLUDED.duration_days,
    duration_nights = EXCLUDED.duration_nights,
    departure_place = EXCLUDED.departure_place,
    price_adult = EXCLUDED.price_adult,
    price_child = EXCLUDED.price_child,
    max_participants = EXCLUDED.max_participants,
    min_participants = EXCLUDED.min_participants,
    imageurl = EXCLUDED.imageurl,
    status = EXCLUDED.status,
    ranking = EXCLUDED.ranking,
    tour_type_id = EXCLUDED.tour_type_id;

INSERT INTO tour_destinations (tour_destinationid, tour_id, destination_id) VALUES
('td-test-005k', 'tour-test-005k', 'dest-mb-01'),
('td-test-010k', 'tour-test-010k', 'dest-mb-02'),
('td-test-015k', 'tour-test-015k', 'dest-mb-03'),
('td-test-100k', 'tour-test-100k', 'dest-mt-02'),
('td-test-150k', 'tour-test-150k', 'dest-mn-02')
ON CONFLICT (tour_destinationid) DO UPDATE SET
    tour_id = EXCLUDED.tour_id,
    destination_id = EXCLUDED.destination_id;

INSERT INTO tour_images (tour_imageid, url, caption, tour_id) VALUES
('timg-test-005k-1', '/images/tours/hanoi_tour.webp', 'Hà Nội mini tour', 'tour-test-005k'),
('timg-test-010k-1', '/images/tours/halong_tour.jpg', 'Hạ Long mini tour', 'tour-test-010k'),
('timg-test-015k-1', '/images/tours/sapa_cover.jpg', 'Sa Pa mini tour', 'tour-test-015k'),
('timg-test-100k-1', '/images/tours/danang_tour.jpg', 'Đà Nẵng mini tour', 'tour-test-100k'),
('timg-test-150k-1', '/images/tours/phuquoc_cover.jpg', 'Phú Quốc mini tour', 'tour-test-150k')
ON CONFLICT (tour_imageid) DO UPDATE SET
    url = EXCLUDED.url,
    caption = EXCLUDED.caption,
    tour_id = EXCLUDED.tour_id;

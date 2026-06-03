-- Thêm 100 tour mẫu cho môi trường local.
-- Mỗi tour có:
-- - 3 ảnh trong bảng tour_images
-- - liên kết 1 điểm đến trong bảng tour_destinations
-- - itineraries theo số ngày
-- - gắn khuyến mãi 5% -> 50% để feed "Hot deal" đa dạng hơn
--
-- Script an toàn khi chạy lại nhiều lần (dùng ON CONFLICT).

BEGIN;

WITH promotion_seed(discount_percentage) AS (
  VALUES (5), (10), (15), (20), (25), (30), (35), (40), (45), (50)
)
INSERT INTO promotions (
  promotionid,
  title,
  "description",
  discount_percentage,
  discount_amount,
  limit_usage,
  current_usage,
  start_date,
  end_date,
  status,
  created_at,
  update_date
)
SELECT
  format('promo-seed-%s', lpad(discount_percentage::text, 2, '0')),
  format('Ưu đãi %s%%', discount_percentage),
  format('Khuyến mãi giảm %s%% cho tour nổi bật', discount_percentage),
  discount_percentage,
  0,
  100000,
  0,
  DATE '2026-01-01',
  DATE '2028-12-31',
  'ACTIVE',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM promotion_seed
ON CONFLICT (promotionid) DO UPDATE SET
  title = EXCLUDED.title,
  "description" = EXCLUDED."description",
  discount_percentage = EXCLUDED.discount_percentage,
  discount_amount = EXCLUDED.discount_amount,
  limit_usage = EXCLUDED.limit_usage,
  current_usage = EXCLUDED.current_usage,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  status = EXCLUDED.status,
  update_date = CURRENT_TIMESTAMP;

WITH destination_pool(idx, destination_id, destination_name, departure_place, image_1, image_2, image_3, tour_type_id) AS (
  VALUES
    (1,  'dest-mb-01', 'Hà Nội', 'TP. Hồ Chí Minh', '/images/tours/hanoi_tour.webp',      '/images/destinations/hanoi02_des.jpg',     '/images/destinations/hanoi03_des.jpg',     'type-03'),
    (2,  'dest-mb-02', 'Vịnh Hạ Long', 'Hà Nội',     '/images/tours/halong_tour.jpg',       '/images/destinations/halong02_des.jpg',    '/images/destinations/halong03_des.jpg',    'type-01'),
    (3,  'dest-mb-03', 'Sa Pa', 'Hà Nội',            '/images/tours/sapa_cover.jpg',        '/images/destinations/sapa02_des.jpg',      '/images/destinations/sapa03_des.webp',     'type-02'),
    (4,  'dest-mb-04', 'Ninh Bình', 'Hà Nội',        '/images/tours/ninhbinh_tour.jpg',     '/images/destinations/ninhbinh02_des.jpg',  '/images/destinations/ninhbinh03_des.webp', 'type-03'),
    (5,  'dest-mb-05', 'Mộc Châu', 'Hà Nội',         '/images/tours/mocchau_tour.jpg',      '/images/destinations/mocchau02_des.jpg',   '/images/destinations/mocchau03_des.jpg',   'type-02'),
    (6,  'dest-mb-06', 'Hà Giang', 'Hà Nội',         '/images/tours/hagiang_tour.jpg',      '/images/destinations/hagiang02_des.jpg',   '/images/destinations/hagiang03_des.webp',  'type-05'),
    (7,  'dest-mt-02', 'Đà Nẵng', 'TP. Hồ Chí Minh', '/images/tours/danang_tour.jpg',       '/images/destinations/danang02_des.webp',   '/images/destinations/danang03_des.png',    'type-01'),
    (8,  'dest-mt-05', 'Nha Trang', 'Hà Nội',        '/images/tours/nhatrang_tour.jpg',     '/images/destinations/nhatrang02_des.jpg',  '/images/destinations/nhatrang03_des.webp', 'type-01'),
    (9,  'dest-mn-02', 'Phú Quốc', 'TP. Hồ Chí Minh','/images/tours/phuquoc_cover.jpg',     '/images/destinations/phuquoc02_des.jpg',   '/images/destinations/phuquoc03_des.jpg',   'type-01'),
    (10, 'dest-mn-05', 'Vũng Tàu', 'TP. Hồ Chí Minh','/images/tours/vungtau_tour.jpg',      '/images/destinations/vungtau02_des.jpg',   '/images/destinations/vungtau03_des.jpg',   'type-01')
),
seed AS (
  SELECT
    gs AS n,
    lpad(gs::text, 3, '0') AS code,
    ((gs - 1) % 10) + 1 AS destination_idx,
    DATE '2026-06-01' + ((gs - 1) % 240) AS start_date,
    CASE
      WHEN gs % 5 = 0 THEN 4
      WHEN gs % 3 = 0 THEN 3
      ELSE 2
    END AS duration_days
  FROM generate_series(1, 100) AS gs
),
tour_seed AS (
  SELECT
    format('tour-seed-%s', s.code) AS tour_id,
    s.code,
    d.destination_id,
    d.destination_name,
    d.departure_place,
    d.image_1,
    d.image_2,
    d.image_3,
    d.tour_type_id,
    s.start_date,
    (s.start_date + (s.duration_days - 1))::date AS end_date,
    s.duration_days,
    GREATEST(s.duration_days - 1, 1) AS duration_nights,
    (1500000 + s.n * 45000) AS price_adult,
    floor((1500000 + s.n * 45000) * 0.72)::int AS price_child,
    (20 + (s.n % 16)) AS max_participants,
    (2 + (s.n % 4)) AS min_participants,
    (100 + s.n) AS ranking,
    CASE (s.n % 6)
      WHEN 0 THEN 'Biển xanh thư giãn'
      WHEN 1 THEN 'Khám phá văn hóa địa phương'
      WHEN 2 THEN 'Ẩm thực đặc sản vùng miền'
      WHEN 3 THEN 'Lịch trình nhẹ cho gia đình'
      WHEN 4 THEN 'Trải nghiệm thiên nhiên'
      ELSE 'Điểm check-in nổi bật'
    END AS theme
  FROM seed s
  JOIN destination_pool d ON d.idx = s.destination_idx
)
INSERT INTO tours (
  tourid,
  title,
  "description",
  start_date,
  end_date,
  duration_days,
  duration_nights,
  departure_place,
  price_adult,
  price_child,
  max_participants,
  min_participants,
  imageurl,
  status,
  ranking,
  tour_type_id
)
SELECT
  ts.tour_id,
  format('%s %sN%sĐ: %s', ts.destination_name, ts.duration_days, ts.duration_nights, ts.theme),
  format('Hành trình %s ngày tại %s. Lịch trình tối ưu, dịch vụ rõ ràng, phù hợp đi cùng bạn bè hoặc gia đình.', ts.duration_days, ts.destination_name),
  ts.start_date,
  ts.end_date,
  ts.duration_days,
  ts.duration_nights,
  ts.departure_place,
  ts.price_adult,
  ts.price_child,
  ts.max_participants,
  ts.min_participants,
  ts.image_1,
  'ACTIVE',
  ts.ranking,
  ts.tour_type_id
FROM tour_seed ts
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

WITH seed AS (
  SELECT
    gs AS n,
    lpad(gs::text, 3, '0') AS code,
    ((gs - 1) % 10) + 1 AS destination_idx
  FROM generate_series(1, 100) AS gs
),
destination_pool(idx, destination_id) AS (
  VALUES
    (1, 'dest-mb-01'),
    (2, 'dest-mb-02'),
    (3, 'dest-mb-03'),
    (4, 'dest-mb-04'),
    (5, 'dest-mb-05'),
    (6, 'dest-mb-06'),
    (7, 'dest-mt-02'),
    (8, 'dest-mt-05'),
    (9, 'dest-mn-02'),
    (10, 'dest-mn-05')
)
INSERT INTO tour_destinations (tour_destinationid, tour_id, destination_id)
SELECT
  format('td-seed-%s', s.code),
  format('tour-seed-%s', s.code),
  d.destination_id
FROM seed s
JOIN destination_pool d ON d.idx = s.destination_idx
ON CONFLICT (tour_destinationid) DO UPDATE SET
  tour_id = EXCLUDED.tour_id,
  destination_id = EXCLUDED.destination_id;

WITH destination_pool(idx, image_1, image_2, image_3) AS (
  VALUES
    (1,  '/images/tours/hanoi_tour.webp',   '/images/destinations/hanoi02_des.jpg',    '/images/destinations/hanoi03_des.jpg'),
    (2,  '/images/tours/halong_tour.jpg',   '/images/destinations/halong02_des.jpg',   '/images/destinations/halong03_des.jpg'),
    (3,  '/images/tours/sapa_cover.jpg',    '/images/destinations/sapa02_des.jpg',     '/images/destinations/sapa03_des.webp'),
    (4,  '/images/tours/ninhbinh_tour.jpg', '/images/destinations/ninhbinh02_des.jpg', '/images/destinations/ninhbinh03_des.webp'),
    (5,  '/images/tours/mocchau_tour.jpg',  '/images/destinations/mocchau02_des.jpg',  '/images/destinations/mocchau03_des.jpg'),
    (6,  '/images/tours/hagiang_tour.jpg',  '/images/destinations/hagiang02_des.jpg',  '/images/destinations/hagiang03_des.webp'),
    (7,  '/images/tours/danang_tour.jpg',   '/images/destinations/danang02_des.webp',  '/images/destinations/danang03_des.png'),
    (8,  '/images/tours/nhatrang_tour.jpg', '/images/destinations/nhatrang02_des.jpg', '/images/destinations/nhatrang03_des.webp'),
    (9,  '/images/tours/phuquoc_cover.jpg', '/images/destinations/phuquoc02_des.jpg',  '/images/destinations/phuquoc03_des.jpg'),
    (10, '/images/tours/vungtau_tour.jpg',  '/images/destinations/vungtau02_des.jpg',  '/images/destinations/vungtau03_des.jpg')
),
seed AS (
  SELECT
    gs AS n,
    lpad(gs::text, 3, '0') AS code,
    ((gs - 1) % 10) + 1 AS destination_idx
  FROM generate_series(1, 100) AS gs
),
tour_images_seed AS (
  SELECT
    format('timg-seed-%s-1', s.code) AS tour_imageid,
    format('tour-seed-%s', s.code) AS tour_id,
    d.image_1 AS url,
    'Ảnh lịch trình 1' AS caption
  FROM seed s
  JOIN destination_pool d ON d.idx = s.destination_idx
  UNION ALL
  SELECT
    format('timg-seed-%s-2', s.code),
    format('tour-seed-%s', s.code),
    d.image_2,
    'Ảnh lịch trình 2'
  FROM seed s
  JOIN destination_pool d ON d.idx = s.destination_idx
  UNION ALL
  SELECT
    format('timg-seed-%s-3', s.code),
    format('tour-seed-%s', s.code),
    d.image_3,
    'Ảnh lịch trình 3'
  FROM seed s
  JOIN destination_pool d ON d.idx = s.destination_idx
)
INSERT INTO tour_images (tour_imageid, url, caption, tour_id)
SELECT tour_imageid, url, caption, tour_id
FROM tour_images_seed
ON CONFLICT (tour_imageid) DO UPDATE SET
  url = EXCLUDED.url,
  caption = EXCLUDED.caption,
  tour_id = EXCLUDED.tour_id;

WITH seed AS (
  SELECT
    gs AS n,
    lpad(gs::text, 3, '0') AS code,
    CASE
      WHEN gs % 5 = 0 THEN 4
      WHEN gs % 3 = 0 THEN 3
      ELSE 2
    END AS duration_days
  FROM generate_series(1, 100) AS gs
)
INSERT INTO itineraries (itineraryid, day_number, title, "description", tour_id)
SELECT
  format('iti-seed-%s-d%s', s.code, day_no),
  day_no,
  format('Ngày %s: Lịch trình tiêu chuẩn', day_no),
  CASE
    WHEN day_no = 1 THEN 'Khởi hành, nhận phòng và tham quan điểm chính trong hành trình.'
    WHEN day_no = s.duration_days THEN 'Tự do mua sắm, trả phòng và kết thúc tour.'
    ELSE 'Tiếp tục tham quan điểm nổi bật, trải nghiệm ẩm thực địa phương.'
  END,
  format('tour-seed-%s', s.code)
FROM seed s
CROSS JOIN LATERAL generate_series(1, s.duration_days) AS day_no
ON CONFLICT (itineraryid) DO UPDATE SET
  day_number = EXCLUDED.day_number,
  title = EXCLUDED.title,
  "description" = EXCLUDED."description",
  tour_id = EXCLUDED.tour_id;

WITH seed AS (
  SELECT
    gs AS n,
    lpad(gs::text, 3, '0') AS code,
    CASE
      WHEN gs % 10 = 0 THEN 50
      WHEN gs % 9 = 0 THEN 45
      WHEN gs % 8 = 0 THEN 40
      WHEN gs % 7 = 0 THEN 35
      WHEN gs % 6 = 0 THEN 30
      WHEN gs % 5 = 0 THEN 25
      WHEN gs % 4 = 0 THEN 20
      WHEN gs % 3 = 0 THEN 15
      WHEN gs % 2 = 0 THEN 10
      ELSE 5
    END AS discount_percentage
  FROM generate_series(1, 100) AS gs
)
INSERT INTO tour_promotions (tour_promotionid, tour_id, promotion_id)
SELECT
  format('tp-seed-%s', code),
  format('tour-seed-%s', code),
  format('promo-seed-%s', lpad(discount_percentage::text, 2, '0'))
FROM seed
ON CONFLICT (tour_promotionid) DO UPDATE SET
  tour_id = EXCLUDED.tour_id,
  promotion_id = EXCLUDED.promotion_id;

COMMIT;

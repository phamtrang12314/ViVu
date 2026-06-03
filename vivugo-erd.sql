-- ViVuGo ERD schema for PostgreSQL / pgAdmin
-- Import or run this script in PostgreSQL, then use pgAdmin ERD Tool
-- to visualize the relationship diagram.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
//fyuimrmfn
-- =========================
-- Core account / user
-- =========================
CREATE TABLE IF NOT EXISTS customers (
    userid VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(255) UNIQUE,
    avatarurl VARCHAR(255),
    address VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
    adminid VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    accountid VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    createdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    customer_id VARCHAR(255) UNIQUE,
    CONSTRAINT fk_accounts_customer
        FOREIGN KEY (customer_id) REFERENCES customers(userid)
        ON DELETE SET NULL
);

-- =========================
-- Destination / tour content
-- =========================
CREATE TABLE IF NOT EXISTS destinations (
    destinationid VARCHAR(50) PRIMARY KEY,
    name_des VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    country VARCHAR(255),
    region VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS images (
    imageid VARCHAR(255) PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    destination_id VARCHAR(255),
    CONSTRAINT fk_images_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destinationid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tour_types (
    tourtypeid VARCHAR(255) PRIMARY KEY,
    name_type VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tours (
    tourid VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER,
    duration_nights INTEGER,
    departure_place VARCHAR(255),
    price_adult DOUBLE PRECISION NOT NULL,
    price_child DOUBLE PRECISION NOT NULL,
    max_participants INTEGER,
    min_participants INTEGER,
    imageurl VARCHAR(255),
    review_video_url VARCHAR(255),
    status VARCHAR(255),
    ranking INTEGER,
    tour_type_id VARCHAR(255),
    CONSTRAINT fk_tours_tour_type
        FOREIGN KEY (tour_type_id) REFERENCES tour_types(tourtypeid)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS tour_images (
    tourimageid VARCHAR(255) PRIMARY KEY,
    url VARCHAR(255) NOT NULL,
    caption VARCHAR(255),
    tour_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_tour_images_tour
        FOREIGN KEY (tour_id) REFERENCES tours(tourid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS itineraries (
    itineraryid VARCHAR(255) PRIMARY KEY,
    day_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tour_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_itineraries_tour
        FOREIGN KEY (tour_id) REFERENCES tours(tourid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tour_destinations (
    tourdestinationid VARCHAR(255) PRIMARY KEY,
    tour_id VARCHAR(255) NOT NULL,
    destination_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_tour_destinations_tour
        FOREIGN KEY (tour_id) REFERENCES tours(tourid)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_destinations_destination
        FOREIGN KEY (destination_id) REFERENCES destinations(destinationid)
        ON DELETE CASCADE
);

-- =========================
-- Promotions / booking
-- =========================
CREATE TABLE IF NOT EXISTS promotions (
    promotionid VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    discount_percentage INTEGER,
    discount_amount DOUBLE PRECISION,
    limit_usage INTEGER,
    current_usage INTEGER NOT NULL DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tour_promotions (
    tourpromotionid VARCHAR(255) PRIMARY KEY,
    tour_id VARCHAR(255) NOT NULL,
    promotion_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_tour_promotions_tour
        FOREIGN KEY (tour_id) REFERENCES tours(tourid)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_promotions_promotion
        FOREIGN KEY (promotion_id) REFERENCES promotions(promotionid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    bookingid VARCHAR(255) PRIMARY KEY,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    num_adults INTEGER,
    num_children INTEGER,
    total_price DOUBLE PRECISION NOT NULL,
    discount_amount DOUBLE PRECISION DEFAULT 0.0,
    final_amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(255) NOT NULL,
    refund_status VARCHAR(255),
    refunded_at TIMESTAMP,
    customer_id VARCHAR(255) NOT NULL,
    tour_id VARCHAR(255) NOT NULL,
    promotion_id VARCHAR(255),
    CONSTRAINT fk_bookings_customer
        FOREIGN KEY (customer_id) REFERENCES customers(userid)
        ON DELETE CASCADE,
    CONSTRAINT fk_bookings_tour
        FOREIGN KEY (tour_id) REFERENCES tours(tourid)
        ON DELETE CASCADE,
    CONSTRAINT fk_bookings_promotion
        FOREIGN KEY (promotion_id) REFERENCES promotions(promotionid)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS invoices (
    invoiceid VARCHAR(255) PRIMARY KEY,
    total_amount DOUBLE PRECISION NOT NULL,
    tax_percentage DOUBLE PRECISION,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    booking_id VARCHAR(255) NOT NULL UNIQUE,
    CONSTRAINT fk_invoices_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(bookingid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS payments (
    paymentid VARCHAR(255) PRIMARY KEY,
    amount_paid DOUBLE PRECISION NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255) NOT NULL,
    payment_method VARCHAR(255),
    transaction_code VARCHAR(255),
    invoice_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_payments_invoice
        FOREIGN KEY (invoice_id) REFERENCES invoices(invoiceid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS participants (
    participantid VARCHAR(255) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(255),
    identification VARCHAR(255),
    gender VARCHAR(255),
    participant_type VARCHAR(255),
    booking_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_participants_booking
        FOREIGN KEY (booking_id) REFERENCES bookings(bookingid)
        ON DELETE CASCADE
);

-- =========================
-- Engagement / support
-- =========================
CREATE TABLE IF NOT EXISTS reviews (
    reviewid VARCHAR(255) PRIMARY KEY,
    rating INTEGER NOT NULL,
    comment TEXT,
    video_url VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(255),
    admin_reply TEXT,
    replied_at TIMESTAMP,
    replied_by VARCHAR(255),
    user_id VARCHAR(255) NOT NULL,
    tour_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_reviews_customer
        FOREIGN KEY (user_id) REFERENCES customers(userid)
        ON DELETE CASCADE,
    CONSTRAINT fk_reviews_tour
        FOREIGN KEY (tour_id) REFERENCES tours(tourid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS favorites (
    favoriteid VARCHAR(255) PRIMARY KEY,
    added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255) NOT NULL,
    tour_id VARCHAR(255) NOT NULL,
    CONSTRAINT uq_favorites_user_tour UNIQUE (user_id, tour_id),
    CONSTRAINT fk_favorites_customer
        FOREIGN KEY (user_id) REFERENCES customers(userid)
        ON DELETE CASCADE,
    CONSTRAINT fk_favorites_tour
        FOREIGN KEY (tour_id) REFERENCES tours(tourid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tour_view_events (
    id VARCHAR(255) PRIMARY KEY,
    session_id VARCHAR(120),
    viewed_region VARCHAR(80),
    viewed_price DOUBLE PRECISION,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tour_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    CONSTRAINT fk_tour_views_tour
        FOREIGN KEY (tour_id) REFERENCES tours(tourid)
        ON DELETE CASCADE,
    CONSTRAINT fk_tour_views_customer
        FOREIGN KEY (user_id) REFERENCES customers(userid)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS support_conversations (
    conversationid VARCHAR(255) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(255),
    last_message_preview TEXT,
    replied BOOLEAN NOT NULL DEFAULT FALSE,
    last_message_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    CONSTRAINT fk_conversations_customer
        FOREIGN KEY (user_id) REFERENCES customers(userid)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS support_messages (
    supportmessageid VARCHAR(255) PRIMARY KEY,
    sender_type VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    conversation_id VARCHAR(255) NOT NULL,
    CONSTRAINT fk_support_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES support_conversations(conversationid)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact_messages (
    contactmessid VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    subject VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    message TEXT NOT NULL,
    sent_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded BOOLEAN NOT NULL DEFAULT FALSE,
    responded_at TIMESTAMP,
    responded_by VARCHAR(255),
    user_id VARCHAR(255),
    conversation_id VARCHAR(255),
    CONSTRAINT fk_contact_messages_customer
        FOREIGN KEY (user_id) REFERENCES customers(userid)
        ON DELETE SET NULL,
    CONSTRAINT fk_contact_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES support_conversations(conversationid)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS otp_codes (
    otpid VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(255) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


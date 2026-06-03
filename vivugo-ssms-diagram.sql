-- ViVuGo schema for Microsoft SQL Server / SSMS Database Diagram
-- Chạy script này trong một database trống, sau đó mở Database Diagrams
-- để tạo sơ đồ quan hệ.

-- ==========================================
-- Drop existing tables so script can rerun
-- ==========================================
tewgfds
    etfad
    rèwas
    èa
IF OBJECT_ID('dbo.Contact_Messages', 'U') IS NOT NULL DROP TABLE dbo.Contact_Messages;
IF OBJECT_ID('dbo.Support_Messages', 'U') IS NOT NULL DROP TABLE dbo.Support_Messages;
IF OBJECT_ID('dbo.Support_Conversations', 'U') IS NOT NULL DROP TABLE dbo.Support_Conversations;
IF OBJECT_ID('dbo.Otp_Codes', 'U') IS NOT NULL DROP TABLE dbo.Otp_Codes;
IF OBJECT_ID('dbo.Tour_View_Events', 'U') IS NOT NULL DROP TABLE dbo.Tour_View_Events;
IF OBJECT_ID('dbo.Favorites', 'U') IS NOT NULL DROP TABLE dbo.Favorites;
IF OBJECT_ID('dbo.Reviews', 'U') IS NOT NULL DROP TABLE dbo.Reviews;
IF OBJECT_ID('dbo.Participants', 'U') IS NOT NULL DROP TABLE dbo.Participants;
IF OBJECT_ID('dbo.Payments', 'U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID('dbo.Invoices', 'U') IS NOT NULL DROP TABLE dbo.Invoices;
IF OBJECT_ID('dbo.Bookings', 'U') IS NOT NULL DROP TABLE dbo.Bookings;
IF OBJECT_ID('dbo.Tour_Promotions', 'U') IS NOT NULL DROP TABLE dbo.Tour_Promotions;
IF OBJECT_ID('dbo.Tour_Destinations', 'U') IS NOT NULL DROP TABLE dbo.Tour_Destinations;
IF OBJECT_ID('dbo.Tour_Images', 'U') IS NOT NULL DROP TABLE dbo.Tour_Images;
IF OBJECT_ID('dbo.Itineraries', 'U') IS NOT NULL DROP TABLE dbo.Itineraries;
IF OBJECT_ID('dbo.Tours', 'U') IS NOT NULL DROP TABLE dbo.Tours;
IF OBJECT_ID('dbo.Promotions', 'U') IS NOT NULL DROP TABLE dbo.Promotions;
IF OBJECT_ID('dbo.Images', 'U') IS NOT NULL DROP TABLE dbo.Images;
IF OBJECT_ID('dbo.Accounts', 'U') IS NOT NULL DROP TABLE dbo.Accounts;
IF OBJECT_ID('dbo.Tour_Types', 'U') IS NOT NULL DROP TABLE dbo.Tour_Types;
IF OBJECT_ID('dbo.Destinations', 'U') IS NOT NULL DROP TABLE dbo.Destinations;
IF OBJECT_ID('dbo.Admins', 'U') IS NOT NULL DROP TABLE dbo.Admins;
IF OBJECT_ID('dbo.Customers', 'U') IS NOT NULL DROP TABLE dbo.Customers;

-- =========================
-- Core account / user
-- =========================
CREATE TABLE dbo.Customers (
    UserID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Phone_Number NVARCHAR(255) NULL UNIQUE,
    AvatarURL NVARCHAR(255) NULL,
    Address NVARCHAR(255) NULL,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.Admins (
    AdminID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL,
    Phone_Number NVARCHAR(255) NOT NULL UNIQUE,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(255) NOT NULL,
    Locked BIT NOT NULL DEFAULT 0,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Updated_At DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.Accounts (
    AccountID NVARCHAR(255) NOT NULL PRIMARY KEY,
    UserName NVARCHAR(255) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Role NVARCHAR(255) NOT NULL,
    CreateDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    UpdateDate DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    IsLocked BIT NOT NULL DEFAULT 0,
    Customer_ID NVARCHAR(255) NULL UNIQUE
);

ALTER TABLE dbo.Accounts
ADD CONSTRAINT FK_Accounts_Customers
FOREIGN KEY (Customer_ID) REFERENCES dbo.Customers(UserID);

-- =========================
-- Destination / tour content
-- =========================
CREATE TABLE dbo.Destinations (
    DestinationID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Name_Des NVARCHAR(255) NOT NULL,
    Location NVARCHAR(255) NULL,
    Country NVARCHAR(255) NULL,
    Region NVARCHAR(255) NULL
);

CREATE TABLE dbo.Images (
    ImageID NVARCHAR(255) NOT NULL PRIMARY KEY,
    URL NVARCHAR(255) NOT NULL,
    Caption NVARCHAR(255) NULL,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Destination_ID NVARCHAR(255) NULL
);

ALTER TABLE dbo.Images
ADD CONSTRAINT FK_Images_Destinations
FOREIGN KEY (Destination_ID) REFERENCES dbo.Destinations(DestinationID)
ON DELETE CASCADE;

CREATE TABLE dbo.Tour_Types (
    TourTypeID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Name_Type NVARCHAR(255) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NULL,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Update_Date DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.Tours (
    TourID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Duration_Days INT NULL,
    Duration_Nights INT NULL,
    Departure_Place NVARCHAR(255) NULL,
    Price_Adult FLOAT NOT NULL,
    Price_Child FLOAT NOT NULL,
    Max_Participants INT NULL,
    Min_Participants INT NULL,
    ImageURL NVARCHAR(255) NULL,
    Review_Video_Url NVARCHAR(255) NULL,
    Status NVARCHAR(255) NULL,
    Ranking INT NULL,
    Tour_Type_ID NVARCHAR(255) NULL
);

ALTER TABLE dbo.Tours
ADD CONSTRAINT FK_Tours_Tour_Types
FOREIGN KEY (Tour_Type_ID) REFERENCES dbo.Tour_Types(TourTypeID);

CREATE TABLE dbo.Tour_Images (
    TourImageID NVARCHAR(255) NOT NULL PRIMARY KEY,
    URL NVARCHAR(255) NOT NULL,
    Caption NVARCHAR(255) NULL,
    Tour_ID NVARCHAR(255) NOT NULL
);

ALTER TABLE dbo.Tour_Images
ADD CONSTRAINT FK_Tour_Images_Tours
FOREIGN KEY (Tour_ID) REFERENCES dbo.Tours(TourID)
ON DELETE CASCADE;

CREATE TABLE dbo.Itineraries (
    ItineraryID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Day_Number INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    Tour_ID NVARCHAR(255) NOT NULL
);

ALTER TABLE dbo.Itineraries
ADD CONSTRAINT FK_Itineraries_Tours
FOREIGN KEY (Tour_ID) REFERENCES dbo.Tours(TourID)
ON DELETE CASCADE;

CREATE TABLE dbo.Tour_Destinations (
    TourDestinationID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Tour_ID NVARCHAR(255) NOT NULL,
    Destination_ID NVARCHAR(255) NOT NULL
);

ALTER TABLE dbo.Tour_Destinations
ADD CONSTRAINT FK_Tour_Destinations_Tours
FOREIGN KEY (Tour_ID) REFERENCES dbo.Tours(TourID)
ON DELETE CASCADE;

ALTER TABLE dbo.Tour_Destinations
ADD CONSTRAINT FK_Tour_Destinations_Destinations
FOREIGN KEY (Destination_ID) REFERENCES dbo.Destinations(DestinationID)
ON DELETE CASCADE;

-- =========================
-- Promotions / booking
-- =========================
CREATE TABLE dbo.Promotions (
    PromotionID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL UNIQUE,
    Description NVARCHAR(MAX) NULL,
    Discount_Percentage INT NULL,
    Discount_Amount FLOAT NULL,
    Limit_Usage INT NULL,
    Current_Usage INT NOT NULL DEFAULT 0,
    Start_Date DATE NOT NULL,
    End_Date DATE NOT NULL,
    Status NVARCHAR(255) NULL,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Update_Date DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE dbo.Tour_Promotions (
    TourPromotionID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Tour_ID NVARCHAR(255) NOT NULL,
    Promotion_ID NVARCHAR(255) NOT NULL
);

ALTER TABLE dbo.Tour_Promotions
ADD CONSTRAINT FK_Tour_Promotions_Tours
FOREIGN KEY (Tour_ID) REFERENCES dbo.Tours(TourID)
ON DELETE CASCADE;

ALTER TABLE dbo.Tour_Promotions
ADD CONSTRAINT FK_Tour_Promotions_Promotions
FOREIGN KEY (Promotion_ID) REFERENCES dbo.Promotions(PromotionID)
ON DELETE CASCADE;

CREATE TABLE dbo.Bookings (
    BookingID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Booking_Date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Num_Adults INT NULL,
    Num_Children INT NULL,
    Total_Price FLOAT NOT NULL,
    Discount_Amount FLOAT NOT NULL DEFAULT 0,
    Final_Amount FLOAT NOT NULL,
    Status NVARCHAR(255) NOT NULL,
    Refund_Status NVARCHAR(255) NULL,
    Refunded_At DATETIME2 NULL,
    Customer_ID NVARCHAR(255) NOT NULL,
    Tour_ID NVARCHAR(255) NOT NULL,
    Promotion_ID NVARCHAR(255) NULL
);

ALTER TABLE dbo.Bookings
ADD CONSTRAINT FK_Bookings_Customers
FOREIGN KEY (Customer_ID) REFERENCES dbo.Customers(UserID)
ON DELETE CASCADE;

ALTER TABLE dbo.Bookings
ADD CONSTRAINT FK_Bookings_Tours
FOREIGN KEY (Tour_ID) REFERENCES dbo.Tours(TourID)
ON DELETE CASCADE;

ALTER TABLE dbo.Bookings
ADD CONSTRAINT FK_Bookings_Promotions
FOREIGN KEY (Promotion_ID) REFERENCES dbo.Promotions(PromotionID)
ON DELETE SET NULL;

CREATE TABLE dbo.Invoices (
    InvoiceID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Total_Amount FLOAT NOT NULL,
    Tax_Percentage FLOAT NULL,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Booking_ID NVARCHAR(255) NOT NULL UNIQUE
);

ALTER TABLE dbo.Invoices
ADD CONSTRAINT FK_Invoices_Bookings
FOREIGN KEY (Booking_ID) REFERENCES dbo.Bookings(BookingID)
ON DELETE CASCADE;

CREATE TABLE dbo.Payments (
    PaymentID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Amount_Paid FLOAT NOT NULL,
    Payment_Date DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Status NVARCHAR(255) NOT NULL,
    Payment_Method NVARCHAR(255) NULL,
    Transaction_Code NVARCHAR(255) NULL,
    Invoice_ID NVARCHAR(255) NOT NULL
);

ALTER TABLE dbo.Payments
ADD CONSTRAINT FK_Payments_Invoices
FOREIGN KEY (Invoice_ID) REFERENCES dbo.Invoices(InvoiceID)
ON DELETE CASCADE;

CREATE TABLE dbo.Participants (
    ParticipantID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Customer_Name NVARCHAR(255) NOT NULL,
    Customer_Phone NVARCHAR(255) NULL,
    Identification NVARCHAR(255) NULL,
    Gender NVARCHAR(255) NULL,
    Participant_Type NVARCHAR(255) NULL,
    Booking_ID NVARCHAR(255) NOT NULL
);

ALTER TABLE dbo.Participants
ADD CONSTRAINT FK_Participants_Bookings
FOREIGN KEY (Booking_ID) REFERENCES dbo.Bookings(BookingID)
ON DELETE CASCADE;

-- =========================
-- Engagement / support
-- =========================
CREATE TABLE dbo.Reviews (
    ReviewID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Rating INT NOT NULL,
    Comment NVARCHAR(MAX) NULL,
    Video_URL NVARCHAR(1000) NULL,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Status NVARCHAR(255) NULL,
    Admin_Reply NVARCHAR(MAX) NULL,
    Replied_At DATETIME2 NULL,
    Replied_By NVARCHAR(255) NULL,
    User_ID NVARCHAR(255) NOT NULL,
    Tour_ID NVARCHAR(255) NOT NULL
);

ALTER TABLE dbo.Reviews
ADD CONSTRAINT FK_Reviews_Customers
FOREIGN KEY (User_ID) REFERENCES dbo.Customers(UserID)
ON DELETE CASCADE;

ALTER TABLE dbo.Reviews
ADD CONSTRAINT FK_Reviews_Tours
FOREIGN KEY (Tour_ID) REFERENCES dbo.Tours(TourID)
ON DELETE CASCADE;

CREATE TABLE dbo.Favorites (
    FavoriteID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Added_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    User_ID NVARCHAR(200) NOT NULL,
    Tour_ID NVARCHAR(200) NOT NULL,
    CONSTRAINT UQ_Favorites_User_Tour UNIQUE (User_ID, Tour_ID)
);

ALTER TABLE dbo.Favorites
ADD CONSTRAINT FK_Favorites_Customers
FOREIGN KEY (User_ID) REFERENCES dbo.Customers(UserID)
ON DELETE CASCADE;

ALTER TABLE dbo.Favorites
ADD CONSTRAINT FK_Favorites_Tours
FOREIGN KEY (Tour_ID) REFERENCES dbo.Tours(TourID)
ON DELETE CASCADE;

CREATE TABLE dbo.Tour_View_Events (
    ID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Session_ID NVARCHAR(120) NULL,
    Viewed_Region NVARCHAR(80) NULL,
    Viewed_Price FLOAT NULL,
    Viewed_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Tour_ID NVARCHAR(255) NOT NULL,
    User_ID NVARCHAR(255) NULL
);

ALTER TABLE dbo.Tour_View_Events
ADD CONSTRAINT FK_Tour_View_Events_Tours
FOREIGN KEY (Tour_ID) REFERENCES dbo.Tours(TourID)
ON DELETE CASCADE;

ALTER TABLE dbo.Tour_View_Events
ADD CONSTRAINT FK_Tour_View_Events_Customers
FOREIGN KEY (User_ID) REFERENCES dbo.Customers(UserID)
ON DELETE SET NULL;

CREATE TABLE dbo.Support_Conversations (
    ConversationID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Customer_Name NVARCHAR(255) NOT NULL,
    Customer_Email NVARCHAR(255) NOT NULL,
    Customer_Phone NVARCHAR(255) NULL,
    Last_Message_Preview NVARCHAR(MAX) NULL,
    Replied BIT NOT NULL DEFAULT 0,
    Last_Message_At DATETIME2 NULL,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Updated_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    User_ID NVARCHAR(255) NULL
);

ALTER TABLE dbo.Support_Conversations
ADD CONSTRAINT FK_Support_Conversations_Customers
FOREIGN KEY (User_ID) REFERENCES dbo.Customers(UserID)
ON DELETE SET NULL;

CREATE TABLE dbo.Support_Messages (
    SupportMessageID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Conversation_ID NVARCHAR(255) NOT NULL,
    Sender_Type NVARCHAR(255) NOT NULL,
    Sender_Name NVARCHAR(255) NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

ALTER TABLE dbo.Support_Messages
ADD CONSTRAINT FK_Support_Messages_Conversations
FOREIGN KEY (Conversation_ID) REFERENCES dbo.Support_Conversations(ConversationID)
ON DELETE CASCADE;

CREATE TABLE dbo.Contact_Messages (
    ContactMessID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Name NVARCHAR(255) NULL,
    Subject NVARCHAR(255) NULL,
    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(255) NULL,
    Message NVARCHAR(MAX) NOT NULL,
    Sent_At DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    Responded BIT NOT NULL DEFAULT 0,
    Responded_At DATETIME2 NULL,
    Responded_By NVARCHAR(255) NULL,
    User_ID NVARCHAR(255) NULL,
    Conversation_ID NVARCHAR(255) NULL
);

ALTER TABLE dbo.Contact_Messages
ADD CONSTRAINT FK_Contact_Messages_Customers
FOREIGN KEY (User_ID) REFERENCES dbo.Customers(UserID)
ON DELETE SET NULL;

ALTER TABLE dbo.Contact_Messages
ADD CONSTRAINT FK_Contact_Messages_Conversations
FOREIGN KEY (Conversation_ID) REFERENCES dbo.Support_Conversations(ConversationID)
ON DELETE SET NULL;

CREATE TABLE dbo.Otp_Codes (
    OtpID NVARCHAR(255) NOT NULL PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL,
    Code NVARCHAR(255) NOT NULL,
    Purpose NVARCHAR(255) NOT NULL,
    Expires_At DATETIME2 NOT NULL,
    Used BIT NOT NULL DEFAULT 0,
    Created_At DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);


/**/

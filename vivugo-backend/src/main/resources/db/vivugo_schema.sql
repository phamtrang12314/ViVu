-- ViVuGo PostgreSQL baseline.
-- Hibernate ddl-auto=update can evolve this in dev; keep this file as the explicit schema contract.

create table if not exists customers (
  userid varchar(255) primary key,
  name varchar(255) not null,
  email varchar(255) not null unique,
  phone_number varchar(255) unique,
  avatarurl varchar(255),
  address varchar(255),
  created_at timestamp not null default current_timestamp
);

create table if not exists admins (
  adminid varchar(255) primary key,
  name varchar(255) not null,
  phone_number varchar(255) not null unique,
  email varchar(255) not null unique,
  password varchar(255) not null,
  role varchar(50) not null default 'ADMIN',
  locked boolean not null default false,
  created_at timestamp default current_timestamp,
  updated_at timestamp default current_timestamp
);

create table if not exists accounts (
  accountid varchar(255) primary key,
  user_name varchar(255) not null unique,
  password varchar(255) not null,
  role varchar(50) not null,
  create_date timestamp not null default current_timestamp,
  update_date timestamp,
  is_locked boolean not null default false,
  customer_id varchar(255) references customers(userid)
);

create table if not exists otp_codes (
  otpid varchar(255) primary key,
  email varchar(255) not null,
  code varchar(20) not null,
  purpose varchar(50) not null,
  expires_at timestamp not null,
  used boolean not null default false,
  created_at timestamp default current_timestamp
);

alter table if exists bookings
  add column if not exists customer_id varchar(255);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'fk_bookings_customer'
  ) then
    alter table bookings
      add constraint fk_bookings_customer
      foreign key (customer_id) references customers(userid);
  end if;
end $$;

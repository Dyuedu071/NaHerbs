-- =============================================================
-- NaHerbs Supabase PostgreSQL Schema v3 - UUID IDs
-- File: 001_init_schema.sql
-- Usage: Run manually in Supabase SQL Editor or via Supabase CLI.
-- Important: This project does NOT use Flyway auto migration.
-- =============================================================

create schema if not exists naherb;
create extension if not exists pgcrypto with schema extensions;

set search_path = naherb, public, extensions;

-- =============================================================
-- 1. Utility
-- =============================================================

create or replace function naherb.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =============================================================
-- 2. Enum types
-- =============================================================



do $$ begin
  create type naherb.content_status as enum ('DRAFT', 'PUBLISHED', 'HIDDEN', 'ARCHIVED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.sku_status as enum ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.stock_status as enum ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.media_type as enum ('PRODUCT', 'BLOG', 'LOGO', 'QR', 'OTHER');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.lead_status as enum ('NEW', 'CONTACTED', 'PROCESSING', 'DONE', 'IGNORED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.lead_source as enum ('CONTACT_FORM', 'PRODUCT_DETAIL', 'CHATBOT', 'BLOG_CTA', 'CHECKOUT');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.order_status as enum ('PENDING', 'CONFIRMED', 'PACKING', 'SHIPPING', 'COMPLETED', 'CANCELLED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.payment_method as enum ('COD', 'BANK_QR');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.payment_status as enum ('UNPAID', 'PENDING_MANUAL_CONFIRMATION', 'PAID', 'REJECTED', 'REFUNDED');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.chat_sender_type as enum ('USER', 'ASSISTANT', 'SYSTEM');
exception when duplicate_object then null; end $$;

do $$ begin
  create type naherb.chat_conversation_status as enum ('OPEN', 'CONVERTED', 'NEED_FOLLOW_UP', 'CLOSED', 'ARCHIVED');
exception when duplicate_object then null; end $$;

-- =============================================================
-- 3. Auth, profile and shipping address
-- =============================================================
-- accounts maps to vn.io.naherb.account.Account with UUID primary key.
-- This table is for login/security only. Current Java entity may still contain `name`,
-- so SQL keeps it until the entity is refactored. Business/customer data
-- belongs to account_profiles and account_addresses.
-- Java entity must use UUID id to match this schema.

create table if not exists naherb.accounts (
  id uuid primary key default gen_random_uuid(),
  email varchar(254) not null unique,
  password varchar(255) not null,
  name varchar(100) not null,
  role varchar(20) not null default 'USER',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accounts_role_chk check (role in ('USER', 'ADMIN'))
);

create index if not exists idx_accounts_role on naherb.accounts(role);
create index if not exists idx_accounts_enabled on naherb.accounts(enabled);

drop trigger if exists trg_accounts_updated_at on naherb.accounts;
create trigger trg_accounts_updated_at
before update on naherb.accounts
for each row execute function naherb.set_updated_at();

-- Customer/admin profile information. For ADMIN, this can store display/contact info.
-- For USER, this stores customer profile separate from login credentials.
create table if not exists naherb.account_profiles (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references naherb.accounts(id) on delete cascade,
  full_name varchar(255),
  phone varchar(30),
  contact_email varchar(254),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint account_profiles_phone_unique unique (phone),
  constraint account_profiles_contact_email_unique unique (contact_email)
);

create index if not exists idx_account_profiles_account_id on naherb.account_profiles(account_id);
create index if not exists idx_account_profiles_phone on naherb.account_profiles(phone);

drop trigger if exists trg_account_profiles_updated_at on naherb.account_profiles;
create trigger trg_account_profiles_updated_at
before update on naherb.account_profiles
for each row execute function naherb.set_updated_at();

-- Vietnam administrative address model after two-level local government:
-- Province/City -> Ward/Commune/Special zone. No district field.
create table if not exists naherb.account_addresses (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references naherb.accounts(id) on delete cascade,
  receiver_name varchar(255) not null,
  receiver_phone varchar(30) not null,
  receiver_email varchar(254),
  province_code varchar(30),
  province_name varchar(255) not null,
  ward_code varchar(30),
  ward_name varchar(255) not null,
  address_line text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_account_addresses_account_id on naherb.account_addresses(account_id);

drop trigger if exists trg_account_addresses_updated_at on naherb.account_addresses;
create trigger trg_account_addresses_updated_at
before update on naherb.account_addresses
for each row execute function naherb.set_updated_at();

-- =============================================================
-- 4. Media and settings
-- =============================================================

create table if not exists naherb.media_assets (
  id uuid primary key default gen_random_uuid(),
  type naherb.media_type not null default 'OTHER',
  url text not null,
  storage_path text,
  file_name varchar(255),
  mime_type varchar(100),
  file_size_bytes bigint,
  alt_text varchar(255),
  created_at timestamptz not null default now()
);

create table if not exists naherb.site_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key varchar(100) not null unique,
  setting_value text,
  value_type varchar(50) not null default 'TEXT',
  description text,
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_site_settings_updated_at on naherb.site_settings;
create trigger trg_site_settings_updated_at
before update on naherb.site_settings
for each row execute function naherb.set_updated_at();

-- =============================================================
-- 5. Product catalog
-- Product -> Version -> SKU. SKU is the sellable inventory unit.
-- =============================================================

create table if not exists naherb.product_categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  slug varchar(255) not null unique,
  description text,
  thumbnail_media_id uuid references naherb.media_assets(id) on delete set null,
  display_order int not null default 0,
  status naherb.content_status not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_product_categories_updated_at on naherb.product_categories;
create trigger trg_product_categories_updated_at
before update on naherb.product_categories
for each row execute function naherb.set_updated_at();

create table if not exists naherb.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references naherb.product_categories(id) on delete set null,
  name varchar(255) not null,
  slug varchar(255) not null unique,
  short_description text,
  detail_description text,
  benefits text,
  usage_instruction text,
  preservation_instruction text,
  safety_note text,
  seo_title varchar(255),
  seo_description text,
  primary_keyword varchar(255),
  status naherb.content_status not null default 'DRAFT',
  is_featured boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_products_updated_at on naherb.products;
create trigger trg_products_updated_at
before update on naherb.products
for each row execute function naherb.set_updated_at();

create table if not exists naherb.product_versions (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references naherb.products(id) on delete cascade,
  name varchar(255) not null,
  code varchar(100),
  description text,
  display_order int not null default 0,
  status naherb.content_status not null default 'PUBLISHED',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_versions_unique_code unique (product_id, code)
);

drop trigger if exists trg_product_versions_updated_at on naherb.product_versions;
create trigger trg_product_versions_updated_at
before update on naherb.product_versions
for each row execute function naherb.set_updated_at();

create table if not exists naherb.product_skus (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references naherb.products(id) on delete cascade,
  version_id uuid references naherb.product_versions(id) on delete cascade,
  sku_code varchar(100) unique,
  sku_name varchar(255) not null,
  color varchar(100),
  scent varchar(100),
  size varchar(100),
  type varchar(100),
  original_price numeric(12,2),
  sale_price numeric(12,2) not null,
  stock_quantity int not null default 0,
  low_stock_threshold int not null default 3,
  stock_status naherb.stock_status not null default 'IN_STOCK',
  status naherb.sku_status not null default 'ACTIVE',
  thumbnail_media_id uuid references naherb.media_assets(id) on delete set null,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint product_skus_price_chk check (sale_price >= 0 and (original_price is null or original_price >= sale_price)),
  constraint product_skus_stock_chk check (stock_quantity >= 0),
  constraint product_skus_version_product_fk unique (id, product_id)
);

create index if not exists idx_product_skus_product_id on naherb.product_skus(product_id);
create index if not exists idx_product_skus_version_id on naherb.product_skus(version_id);
create index if not exists idx_product_skus_status_stock on naherb.product_skus(status, stock_status);

drop trigger if exists trg_product_skus_updated_at on naherb.product_skus;
create trigger trg_product_skus_updated_at
before update on naherb.product_skus
for each row execute function naherb.set_updated_at();

create table if not exists naherb.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references naherb.products(id) on delete cascade,
  sku_id uuid references naherb.product_skus(id) on delete cascade,
  media_id uuid references naherb.media_assets(id) on delete cascade,
  url text not null,
  alt_text varchar(255),
  display_order int not null default 0,
  is_thumbnail boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product_id on naherb.product_images(product_id);
create index if not exists idx_product_images_sku_id on naherb.product_images(sku_id);

-- =============================================================
-- 6. Blog
-- =============================================================

create table if not exists naherb.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(255) not null,
  slug varchar(255) not null unique,
  description text,
  status naherb.content_status not null default 'DRAFT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_blog_categories_updated_at on naherb.blog_categories;
create trigger trg_blog_categories_updated_at
before update on naherb.blog_categories
for each row execute function naherb.set_updated_at();

create table if not exists naherb.blog_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references naherb.blog_categories(id) on delete set null,
  title varchar(255) not null,
  slug varchar(255) not null unique,
  excerpt text,
  content text not null,
  featured_media_id uuid references naherb.media_assets(id) on delete set null,
  seo_title varchar(255),
  seo_description text,
  primary_keyword varchar(255),
  require_disclaimer boolean not null default true,
  status naherb.content_status not null default 'DRAFT',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_blog_posts_updated_at on naherb.blog_posts;
create trigger trg_blog_posts_updated_at
before update on naherb.blog_posts
for each row execute function naherb.set_updated_at();

create table if not exists naherb.blog_post_products (
  blog_post_id uuid not null references naherb.blog_posts(id) on delete cascade,
  product_id uuid not null references naherb.products(id) on delete cascade,
  display_order int not null default 0,
  primary key (blog_post_id, product_id)
);

-- =============================================================
-- 7. Leads
-- =============================================================

create table if not exists naherb.leads (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references naherb.accounts(id) on delete set null,
  full_name varchar(255) not null,
  phone varchar(30) not null,
  email varchar(255),
  message text,
  source naherb.lead_source not null,
  interested_product_id uuid references naherb.products(id) on delete set null,
  interested_sku_id uuid references naherb.product_skus(id) on delete set null,
  quantity int,
  source_page text,
  status naherb.lead_status not null default 'NEW',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint leads_quantity_chk check (quantity is null or quantity > 0)
);

create index if not exists idx_leads_account_id on naherb.leads(account_id);

drop trigger if exists trg_leads_updated_at on naherb.leads;
create trigger trg_leads_updated_at
before update on naherb.leads
for each row execute function naherb.set_updated_at();

-- =============================================================
-- 8. Cart
-- =============================================================

create table if not exists naherb.carts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null unique references naherb.accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_carts_account_id on naherb.carts(account_id);

drop trigger if exists trg_carts_updated_at on naherb.carts;
create trigger trg_carts_updated_at
before update on naherb.carts
for each row execute function naherb.set_updated_at();

create table if not exists naherb.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references naherb.carts(id) on delete cascade,
  sku_id uuid not null references naherb.product_skus(id) on delete restrict,
  quantity int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cart_items_quantity_chk check (quantity > 0),
  constraint cart_items_unique_sku unique (cart_id, sku_id)
);

create index if not exists idx_cart_items_cart_id on naherb.cart_items(cart_id);

drop trigger if exists trg_cart_items_updated_at on naherb.cart_items;
create trigger trg_cart_items_updated_at
before update on naherb.cart_items
for each row execute function naherb.set_updated_at();

-- =============================================================
-- 9. Orders and payments
-- =============================================================

create table if not exists naherb.orders (
  id uuid primary key default gen_random_uuid(),
  order_code varchar(50) not null unique,
  account_id uuid not null references naherb.accounts(id) on delete restrict,
  status naherb.order_status not null default 'PENDING',
  payment_method naherb.payment_method not null,
  payment_status naherb.payment_status not null default 'UNPAID',
  subtotal_amount numeric(12,2) not null default 0,
  shipping_fee numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  receiver_name varchar(255) not null,
  receiver_phone varchar(30) not null,
  receiver_email varchar(254),
  shipping_province_code varchar(30),
  shipping_province_name varchar(255) not null,
  shipping_ward_code varchar(30),
  shipping_ward_name varchar(255) not null,
  shipping_address_line text not null,
  customer_note text,
  admin_note text,
  cancelled_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_amount_chk check (subtotal_amount >= 0 and shipping_fee >= 0 and discount_amount >= 0 and total_amount >= 0)
);

create index if not exists idx_orders_account_id on naherb.orders(account_id);
create index if not exists idx_orders_status_payment on naherb.orders(status, payment_status);
create index if not exists idx_orders_created_at on naherb.orders(created_at desc);

drop trigger if exists trg_orders_updated_at on naherb.orders;
create trigger trg_orders_updated_at
before update on naherb.orders
for each row execute function naherb.set_updated_at();

create table if not exists naherb.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references naherb.orders(id) on delete cascade,
  product_id uuid references naherb.products(id) on delete set null,
  sku_id uuid references naherb.product_skus(id) on delete set null,
  product_name_snapshot varchar(255) not null,
  sku_name_snapshot varchar(255) not null,
  version_snapshot varchar(255),
  color_snapshot varchar(100),
  scent_snapshot varchar(100),
  sku_code_snapshot varchar(100),
  unit_price numeric(12,2) not null,
  quantity int not null,
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now(),
  constraint order_items_quantity_chk check (quantity > 0),
  constraint order_items_amount_chk check (unit_price >= 0 and line_total >= 0)
);

create index if not exists idx_order_items_order_id on naherb.order_items(order_id);

create table if not exists naherb.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references naherb.orders(id) on delete cascade,
  method naherb.payment_method not null,
  status naherb.payment_status not null,
  amount numeric(12,2) not null,
  bank_name varchar(255),
  bank_account_number varchar(100),
  bank_account_name varchar(255),
  transfer_content varchar(255),
  qr_media_id uuid references naherb.media_assets(id) on delete set null,
  customer_transfer_note text,
  verified_by_account_id uuid references naherb.accounts(id) on delete set null,
  verified_at timestamptz,
  rejected_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_amount_chk check (amount >= 0)
);

create index if not exists idx_payments_status on naherb.payments(status);
create index if not exists idx_payments_verified_by_account_id on naherb.payments(verified_by_account_id);

drop trigger if exists trg_payments_updated_at on naherb.payments;
create trigger trg_payments_updated_at
before update on naherb.payments
for each row execute function naherb.set_updated_at();

-- =============================================================
-- 10. Chatbot
-- =============================================================

create table if not exists naherb.chatbot_configs (
  id uuid primary key default gen_random_uuid(),
  enabled boolean not null default true,
  welcome_message text not null,
  fallback_message text not null,
  disclaimer text not null,
  system_prompt text not null,
  suggested_questions jsonb not null default '[]'::jsonb,
  max_products_per_answer int not null default 3,
  updated_at timestamptz not null default now(),
  constraint chatbot_max_products_chk check (max_products_per_answer between 1 and 5)
);

create table if not exists naherb.chatbot_conversations (
  id uuid primary key default gen_random_uuid(),
  session_id varchar(255) not null,
  account_id uuid references naherb.accounts(id) on delete set null,
  customer_name varchar(255),
  customer_phone varchar(30),
  source_page text,
  detected_need varchar(255),
  recommended_product_ids jsonb,
  lead_id uuid references naherb.leads(id) on delete set null,
  status naherb.chat_conversation_status not null default 'OPEN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chatbot_conversations_session on naherb.chatbot_conversations(session_id);
create index if not exists idx_chatbot_conversations_account_id on naherb.chatbot_conversations(account_id);
create index if not exists idx_chatbot_conversations_created on naherb.chatbot_conversations(created_at desc);

drop trigger if exists trg_chatbot_conversations_updated_at on naherb.chatbot_conversations;
create trigger trg_chatbot_conversations_updated_at
before update on naherb.chatbot_conversations
for each row execute function naherb.set_updated_at();

create table if not exists naherb.chatbot_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references naherb.chatbot_conversations(id) on delete cascade,
  sender_type naherb.chat_sender_type not null,
  message_text text not null,
  product_refs jsonb,
  metadata jsonb,
  safety_flag varchar(100),
  created_at timestamptz not null default now()
);

create index if not exists idx_chatbot_messages_conversation on naherb.chatbot_messages(conversation_id, created_at);

-- =============================================================
-- 11. Helpful search indexes
-- =============================================================

create index if not exists idx_products_status_featured on naherb.products(status, is_featured, display_order);
create index if not exists idx_products_name_trgm_like on naherb.products using gin (to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(short_description,'') || ' ' || coalesce(detail_description,'')));
create index if not exists idx_blog_posts_status_published on naherb.blog_posts(status, published_at desc);
create index if not exists idx_blog_posts_search on naherb.blog_posts using gin (to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(excerpt,'') || ' ' || coalesce(content,'')));

-- =============================================================
-- 12. RLS note
-- =============================================================
-- Because naherb-web must NOT connect directly to Supabase, RLS is not required for application safety.
-- The backend enforces authorization. If you later expose Supabase client to frontend, enable RLS and write policies first.

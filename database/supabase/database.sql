-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE naherb.accounts (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    email character varying NOT NULL UNIQUE,
    password character varying NOT NULL,
    name character varying NOT NULL,
    role character varying NOT NULL DEFAULT 'USER'::character varying CHECK (
        role::text = ANY (
            ARRAY[
                'USER'::character varying,
                'ADMIN'::character varying
            ]::text []
        )
    ),
    enabled boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT accounts_pkey PRIMARY KEY (id)
);

CREATE TABLE naherb.account_profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    account_id uuid NOT NULL UNIQUE,
    full_name character varying,
    phone character varying UNIQUE,
    contact_email character varying UNIQUE,
    avatar_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT account_profiles_pkey PRIMARY KEY (id),
    CONSTRAINT account_profiles_account_id_fkey FOREIGN KEY (account_id) REFERENCES naherb.accounts (id)
);

CREATE TABLE naherb.account_addresses (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    account_id uuid NOT NULL,
    receiver_name character varying NOT NULL,
    receiver_phone character varying NOT NULL,
    receiver_email character varying,
    province_name character varying NOT NULL,
    ward_name character varying NOT NULL,
    address_line text NOT NULL,
    is_default boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    note text,
    CONSTRAINT account_addresses_pkey PRIMARY KEY (id),
    CONSTRAINT account_addresses_account_id_fkey FOREIGN KEY (account_id) REFERENCES naherb.accounts (id)
);

CREATE TABLE naherb.media_assets (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    type character varying NOT NULL DEFAULT 'OTHER'::naherb.media_type,
    url text NOT NULL,
    storage_path text,
    file_name character varying,
    mime_type character varying,
    file_size_bytes bigint,
    alt_text character varying,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT media_assets_pkey PRIMARY KEY (id)
);

CREATE TABLE naherb.site_settings (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    setting_key character varying NOT NULL UNIQUE,
    setting_value text,
    value_type character varying NOT NULL DEFAULT 'TEXT'::character varying,
    description text,
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT site_settings_pkey PRIMARY KEY (id)
);

CREATE TABLE naherb.product_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    name character varying NOT NULL,
    slug character varying NOT NULL UNIQUE,
    description text,
    thumbnail_media_id uuid,
    display_order integer NOT NULL DEFAULT 0,
    status character varying NOT NULL DEFAULT 'DRAFT'::naherb.content_status,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT product_categories_pkey PRIMARY KEY (id),
    CONSTRAINT product_categories_thumbnail_media_id_fkey FOREIGN KEY (thumbnail_media_id) REFERENCES naherb.media_assets (id)
);

CREATE TABLE naherb.products (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    category_id uuid,
    name character varying NOT NULL,
    slug character varying NOT NULL UNIQUE,
    short_description text,
    detail_description text,
    benefits text,
    usage_instruction text,
    preservation_instruction text,
    safety_note text,
    seo_title character varying,
    seo_description text,
    primary_keyword character varying,
    status character varying NOT NULL DEFAULT 'DRAFT'::naherb.content_status,
    is_featured boolean NOT NULL DEFAULT false,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES naherb.product_categories (id)
);

CREATE TABLE naherb.product_versions (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    product_id uuid NOT NULL,
    name character varying NOT NULL,
    code character varying,
    description text,
    display_order integer NOT NULL DEFAULT 0,
    status character varying NOT NULL DEFAULT 'PUBLISHED'::naherb.content_status,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT product_versions_pkey PRIMARY KEY (id),
    CONSTRAINT product_versions_product_id_fkey FOREIGN KEY (product_id) REFERENCES naherb.products (id)
);

CREATE TABLE naherb.product_skus (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    product_id uuid NOT NULL,
    version_id uuid,
    sku_code character varying UNIQUE,
    sku_name character varying NOT NULL,
    color character varying,
    scent character varying,
    size character varying,
    type character varying,
    original_price numeric,
    sale_price numeric NOT NULL,
    stock_quantity integer NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold integer NOT NULL DEFAULT 3,
    stock_status character varying NOT NULL DEFAULT 'IN_STOCK'::naherb.stock_status,
    status character varying NOT NULL DEFAULT 'ACTIVE'::naherb.sku_status,
    thumbnail_media_id uuid,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT product_skus_pkey PRIMARY KEY (id),
    CONSTRAINT product_skus_product_id_fkey FOREIGN KEY (product_id) REFERENCES naherb.products (id),
    CONSTRAINT product_skus_version_id_fkey FOREIGN KEY (version_id) REFERENCES naherb.product_versions (id),
    CONSTRAINT product_skus_thumbnail_media_id_fkey FOREIGN KEY (thumbnail_media_id) REFERENCES naherb.media_assets (id)
);

CREATE TABLE naherb.product_images (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    product_id uuid NOT NULL,
    sku_id uuid,
    media_id uuid,
    url text NOT NULL,
    alt_text character varying,
    display_order integer NOT NULL DEFAULT 0,
    is_thumbnail boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL,
    CONSTRAINT product_images_pkey PRIMARY KEY (id),
    CONSTRAINT product_images_product_id_fkey FOREIGN KEY (product_id) REFERENCES naherb.products (id),
    CONSTRAINT product_images_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES naherb.product_skus (id),
    CONSTRAINT product_images_media_id_fkey FOREIGN KEY (media_id) REFERENCES naherb.media_assets (id)
);

CREATE TABLE naherb.blog_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    name character varying NOT NULL,
    slug character varying NOT NULL UNIQUE,
    description text,
    status USER - DEFINED NOT NULL DEFAULT 'DRAFT'::naherb.content_status,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    display_order integer NOT NULL DEFAULT 0,
    CONSTRAINT blog_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE naherb.blog_posts (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    category_id uuid,
    title character varying NOT NULL,
    slug character varying NOT NULL UNIQUE,
    excerpt text,
    content text NOT NULL,
    featured_media_id uuid,
    seo_title character varying,
    seo_description text,
    primary_keyword character varying,
    require_disclaimer boolean NOT NULL DEFAULT true,
    status character varying NOT NULL DEFAULT 'DRAFT'::naherb.content_status,
    published_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    is_featured boolean NOT NULL,
    summary text,
    thumbnail_media_id uuid,
    CONSTRAINT blog_posts_pkey PRIMARY KEY (id),
    CONSTRAINT blog_posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES naherb.blog_categories (id),
    CONSTRAINT blog_posts_featured_media_id_fkey FOREIGN KEY (featured_media_id) REFERENCES naherb.media_assets (id),
    CONSTRAINT fknvvkpvfu2cmvmhwi9ggxuv1n6 FOREIGN KEY (thumbnail_media_id) REFERENCES naherb.media_assets (id)
);

CREATE TABLE naherb.blog_post_products (
    blog_post_id uuid NOT NULL,
    product_id uuid NOT NULL,
    display_order integer NOT NULL DEFAULT 0,
    id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    post_id uuid NOT NULL,
    CONSTRAINT blog_post_products_pkey PRIMARY KEY (blog_post_id, product_id),
    CONSTRAINT blog_post_products_blog_post_id_fkey FOREIGN KEY (blog_post_id) REFERENCES naherb.blog_posts (id),
    CONSTRAINT blog_post_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES naherb.products (id),
    CONSTRAINT fk3koky29a8anrki54oplqtvsj0 FOREIGN KEY (post_id) REFERENCES naherb.blog_posts (id)
);

CREATE TABLE naherb.leads (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    account_id uuid,
    full_name character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying,
    message text,
    source character varying NOT NULL,
    interested_product_id uuid,
    interested_sku_id uuid,
    quantity integer CHECK (
        quantity IS NULL
        OR quantity > 0
    ),
    source_page text,
    status character varying NOT NULL DEFAULT 'NEW'::naherb.lead_status,
    admin_note text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    notes text,
    CONSTRAINT leads_pkey PRIMARY KEY (id),
    CONSTRAINT leads_account_id_fkey FOREIGN KEY (account_id) REFERENCES naherb.accounts (id),
    CONSTRAINT leads_interested_product_id_fkey FOREIGN KEY (interested_product_id) REFERENCES naherb.products (id),
    CONSTRAINT leads_interested_sku_id_fkey FOREIGN KEY (interested_sku_id) REFERENCES naherb.product_skus (id)
);

CREATE TABLE naherb.carts (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    account_id uuid NOT NULL UNIQUE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    session_id character varying UNIQUE,
    total_amount numeric NOT NULL,
    CONSTRAINT carts_pkey PRIMARY KEY (id),
    CONSTRAINT carts_account_id_fkey FOREIGN KEY (account_id) REFERENCES naherb.accounts (id)
);

CREATE TABLE naherb.cart_items (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    cart_id uuid NOT NULL,
    sku_id uuid NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT cart_items_pkey PRIMARY KEY (id),
    CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES naherb.carts (id),
    CONSTRAINT cart_items_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES naherb.product_skus (id)
);

CREATE TABLE naherb.orders (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    order_code character varying NOT NULL UNIQUE,
    account_id uuid NOT NULL,
    status character varying NOT NULL DEFAULT 'PENDING'::naherb.order_status,
    payment_method character varying NOT NULL,
    payment_status character varying NOT NULL DEFAULT 'UNPAID'::naherb.payment_status,
    subtotal_amount numeric NOT NULL DEFAULT 0,
    shipping_fee numeric NOT NULL DEFAULT 0,
    discount_amount numeric NOT NULL DEFAULT 0,
    total_amount numeric NOT NULL,
    receiver_name character varying NOT NULL,
    receiver_phone character varying NOT NULL,
    receiver_email character varying,
    shipping_province_code character varying,
    shipping_province_name character varying NOT NULL,
    shipping_ward_code character varying,
    shipping_ward_name character varying NOT NULL,
    shipping_address_line text NOT NULL,
    customer_note text,
    admin_note text,
    cancelled_reason text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    final_amount numeric NOT NULL,
    shipping_address text NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_account_id_fkey FOREIGN KEY (account_id) REFERENCES naherb.accounts (id)
);

CREATE TABLE naherb.order_items (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    order_id uuid NOT NULL,
    product_id uuid,
    sku_id uuid,
    product_name_snapshot character varying NOT NULL,
    sku_name_snapshot character varying NOT NULL,
    version_snapshot character varying,
    color_snapshot character varying,
    scent_snapshot character varying,
    sku_code_snapshot character varying,
    unit_price numeric NOT NULL,
    quantity integer NOT NULL CHECK (quantity > 0),
    line_total numeric NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL,
    sku_name character varying NOT NULL,
    total_price numeric NOT NULL,
    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES naherb.orders (id),
    CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES naherb.products (id),
    CONSTRAINT order_items_sku_id_fkey FOREIGN KEY (sku_id) REFERENCES naherb.product_skus (id)
);

CREATE TABLE naherb.payments (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    order_id uuid NOT NULL UNIQUE,
    method USER - DEFINED NOT NULL,
    status USER - DEFINED NOT NULL,
    amount numeric NOT NULL CHECK (amount >= 0::numeric),
    bank_name character varying,
    bank_account_number character varying,
    bank_account_name character varying,
    transfer_content character varying,
    qr_media_id uuid,
    customer_transfer_note text,
    verified_by_account_id uuid,
    verified_at timestamp with time zone,
    rejected_reason text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    gateway_response text,
    paid_at timestamp with time zone,
    payment_gateway character varying,
    transaction_id character varying,
    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES naherb.orders (id),
    CONSTRAINT payments_qr_media_id_fkey FOREIGN KEY (qr_media_id) REFERENCES naherb.media_assets (id),
    CONSTRAINT payments_verified_by_account_id_fkey FOREIGN KEY (verified_by_account_id) REFERENCES naherb.accounts (id)
);

CREATE TABLE naherb.chatbot_configs (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    enabled boolean NOT NULL DEFAULT true,
    welcome_message text NOT NULL,
    fallback_message text NOT NULL,
    disclaimer text NOT NULL,
    system_prompt text NOT NULL,
    suggested_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
    max_products_per_answer integer NOT NULL DEFAULT 3 CHECK (
        max_products_per_answer >= 1
        AND max_products_per_answer <= 5
    ),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    config_value text,
    description text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    config_key character varying UNIQUE,
    CONSTRAINT chatbot_configs_pkey PRIMARY KEY (id)
);

CREATE TABLE naherb.chatbot_conversations (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    session_id character varying NOT NULL,
    account_id uuid,
    customer_name character varying,
    customer_phone character varying,
    source_page text,
    detected_need character varying,
    recommended_product_ids jsonb,
    lead_id uuid,
    status character varying NOT NULL DEFAULT 'OPEN'::naherb.chat_conversation_status,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT chatbot_conversations_pkey PRIMARY KEY (id),
    CONSTRAINT chatbot_conversations_account_id_fkey FOREIGN KEY (account_id) REFERENCES naherb.accounts (id),
    CONSTRAINT chatbot_conversations_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES naherb.leads (id)
);

CREATE TABLE naherb.chatbot_messages (
    id uuid NOT NULL DEFAULT gen_random_uuid (),
    conversation_id uuid NOT NULL,
    sender_type character varying NOT NULL,
    message_text text NOT NULL,
    product_refs jsonb,
    metadata text,
    safety_flag character varying,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL,
    content text NOT NULL,
    CONSTRAINT chatbot_messages_pkey PRIMARY KEY (id),
    CONSTRAINT chatbot_messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES naherb.chatbot_conversations (id)
);
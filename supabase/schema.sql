-- ============================================================
-- Chef Halavi – Supabase Schema
-- Run this entire file in the Supabase SQL Editor once.
-- ============================================================

-- PRODUCTS
create table products (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  description  text,
  price        numeric,
  image        text[],          -- array of image URLs
  category     text,
  active       boolean default true,
  created_date timestamptz default now()
);

-- MENU ITEMS
create table menu_items (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  description  text,
  price        numeric,
  category     text,
  is_available boolean default true
);

-- ORDERS
create table orders (
  id               uuid default gen_random_uuid() primary key,
  customer_name    text,
  phone            text,
  customer_email   text,
  event_date       date,
  event_type       text,
  guests_count     integer,
  delivery_address text,
  delivery_method  text,
  ready_time       timestamptz,
  is_gift          boolean default false,
  gift_message     text,
  sender_name      text,
  sender_phone     text,
  recipient_name   text,
  notes            text,
  status           text default 'pending',
  total_price      numeric,
  created_date     timestamptz default now()
);

-- ORDER ITEMS  (order_id / product_id — the JS layer maps these to "order" / "product")
create table order_items (
  id         uuid default gen_random_uuid() primary key,
  order_id   uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity   integer,
  price      numeric,
  notes      text
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table products   enable row level security;
alter table menu_items enable row level security;
alter table orders     enable row level security;
alter table order_items enable row level security;

-- Anyone can read products and menu items
create policy "public read products"   on products   for select using (true);
create policy "public read menu_items" on menu_items for select using (true);

-- Only the designated admin can write products / menu items
create policy "admin write products" on products for all
  using (lower(auth.jwt() ->> 'email') = 'avigailregev@gmail.com')
  with check (lower(auth.jwt() ->> 'email') = 'avigailregev@gmail.com');
create policy "admin write menu_items" on menu_items for all
  using (lower(auth.jwt() ->> 'email') = 'avigailregev@gmail.com')
  with check (lower(auth.jwt() ->> 'email') = 'avigailregev@gmail.com');

-- Anyone can place an order (insert)
create policy "public create orders"      on orders      for insert with check (true);
create policy "public create order_items" on order_items for insert with check (true);

-- Only the designated admin can read / update orders
create policy "admin read orders" on orders for select
  using (lower(auth.jwt() ->> 'email') = 'avigailregev@gmail.com');
create policy "admin update orders" on orders for update
  using (lower(auth.jwt() ->> 'email') = 'avigailregev@gmail.com')
  with check (lower(auth.jwt() ->> 'email') = 'avigailregev@gmail.com');
create policy "admin read order_items" on order_items for select
  using (lower(auth.jwt() ->> 'email') = 'avigailregev@gmail.com');

-- Run once in the Supabase SQL Editor for an existing installation.
alter table orders rename column customer_phone to phone;

alter table orders
  add column if not exists delivery_method text,
  add column if not exists ready_time timestamptz,
  add column if not exists is_gift boolean default false,
  add column if not exists gift_message text,
  add column if not exists sender_name text,
  add column if not exists sender_phone text,
  add column if not exists recipient_name text;

-- Apply before deploying the price-range UI. Existing prices are preserved.
begin;
alter table public.products alter column price type text using price::text;
alter table public.order_items alter column price type text using price::text;
notify pgrst, 'reload schema';
commit;

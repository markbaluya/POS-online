-- Run in Supabase Dashboard -> SQL Editor
create table if not exists products (
  id bigint generated always as identity primary key,
  name text not null,
  category text not null default 'Coffee',
  price numeric not null default 0,
  rating text not null default '4.5',
  image_url text,
  created_at timestamptz default now()
);

-- Allow public read + write with anon key (school demo; lock down for production)
alter table products enable row level security;
drop policy if exists "public read" on products;
create policy "public read" on products for select using (true);
drop policy if exists "public insert" on products;
create policy "public insert" on products for insert with check (true);
drop policy if exists "public delete" on products;
create policy "public delete" on products for delete using (true);

-- Seed from your current MENU
insert into products (name, category, price, rating) values
('Coffee Latte','Coffee',4.5,'4.5'),
('Chai Latte','Coffee',5.2,'4.2'),
('Espresso','Coffee',3.5,'4.8'),
('Cappuccino','Coffee',4.0,'4.6'),
('Ramen Bowl','Noodle',14.5,'4.9'),
('Thanos Burger','Burger',9.9,'5.0'),
('Boba Milk Tea','Tea',6.2,'4.8'),
('Pepperoni','Pizza',13.5,'4.8'),
('Fries','Sides',3.9,'4.7');

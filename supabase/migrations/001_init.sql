create type review_status as enum ('pending', 'resolved');
create type tone as enum ('standard', 'friendly', 'apologetic');

create table reviews (
  id               uuid primary key default gen_random_uuid(),
  place_id         text not null,
  source_review_id text not null unique,
  author_name      text not null,
  rating           integer not null check (rating between 1 and 5),
  review_text      text not null,
  review_time      timestamptz not null,
  status           review_status not null default 'pending',
  created_at       timestamptz not null default now()
);

create table ai_responses (
  id          uuid primary key default gen_random_uuid(),
  review_id   uuid not null references reviews(id) on delete cascade,
  tone        tone not null,
  content     text not null,
  is_approved boolean not null default false,
  created_at  timestamptz not null default now()
);

create index on ai_responses(review_id);

alter table reviews enable row level security;
alter table ai_responses enable row level security;

create policy "anon_all" on reviews for all to anon using (true) with check (true);
create policy "anon_all" on ai_responses for all to anon using (true) with check (true);

CREATE TABLE cohorts (
    id uuid primary key default uuid_generate_v4(),
    name text,
    category text,
    location_id uuid references locations(id) on delete cascade
);

CREATE INDEX cohorts_category_idx ON cohorts(category);

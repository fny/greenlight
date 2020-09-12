create table locations (
    id uuid primary key default uuid_generate_v4(),
    name text,
    permalink text unique,
    category string not null.
    phone_number text,
    email text,
    zip_code text,
    hidden boolean default true,

  	-- Timestamps
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

CREATE TRIGGER locations_updated_at_moddatetime
    BEFORE UPDATE ON locations
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime(updated_at);

CREATE INDEX locations_category_idx on locations(category);

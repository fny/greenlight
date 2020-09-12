CREATE TABLE location_accounts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references user(id) on delete cascade,
    location_id uuid references location(id) on delete cascade,
    role text not null,
    attendance_status text,
    approved_by_user_at timestamp,
    approved_by_location_at timestamp,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

CREATE TRIGGER location_accounts_updated_at_moddatetime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime(updated_at);

CREATE INDEX location_accounts_role_idx ON location_accounts(role);

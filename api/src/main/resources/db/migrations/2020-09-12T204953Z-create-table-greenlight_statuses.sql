CREATE TABLE greenlight_statuses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references user(id) on delete cascade,
    location_id uuid references location(id) on delete cascade,
    status text not null,
    status_set_at timestamp not null,
    status_expires_at timestamp not null,
    is_override boolean not null,
    created_by_user_id uuid references user(id) on delete cascade,
    created_at timestamp not nulldefault now()
);

CREATE INDEX greenlight_statuses_status_idx ON location_accounts(role);

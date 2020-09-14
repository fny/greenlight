CREATE TABLE greenlight_statuses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references users(id) on delete cascade,
    status text not null,
    status_set_at timestamp not null,
    status_expires_at timestamp not null,
    is_override boolean not null,
    created_by_user_id uuid references users(id) on delete nullify,
    created_at timestamp not null default now()
);

CREATE INDEX greenlight_statuses_status_idx ON greenlight_statuses(status);

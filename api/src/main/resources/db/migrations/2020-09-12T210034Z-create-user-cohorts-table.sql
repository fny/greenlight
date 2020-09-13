CREATE TABLE user_cohorts (
    user_id uuid references users(id) on delete cascade,
    cohort_id uuid references users(id) on delete cascade,
    created_at timestamp not null default now()
);

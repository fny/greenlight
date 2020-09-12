CREATE TABLE user_cohorts (
    user_id uuid references user(id) on delete cascade,
    cohort_id uuid references user(id) on delete cascade,
    created_at timestamp not null default now()
);

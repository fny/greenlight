CREATE TABLE parents_children (
    parent_user_id uuid references users(id) on delete cascade,
    child_user_id uuid  references users(id) on delete cascade,
	-- Paper Trail
	created_at timestamp not null default now()
);

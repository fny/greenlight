CREATE TABLE users (
	-- Basic info
	id uuid primary key default uuid_generate_v4(),
	first_name text not null,
	last_name text not null,

	-- Auth
	password_digest text,
	password_set_at timestamp,

	password_reset_token text unique,
	password_reset_sent_at timestamp,

	auth_token text not null unique,
	auth_token_set_at timestamp,

	-- Email
	email text unique,
	email_confirmation_token text unique,
	email_confirmation_sent_at timestamp,
	email_confirmed_at timestamp,
	email_unconfirmed text,

	-- Mobile Number
	mobile_number text unique,
	mobile_carrier text,  -- (i.e. AT&T, Verizon, Sprint, we use this to make outbound texts cheaper)
	is_sms_gateway_emailable boolean not null default false, -- Can the user receive texts from email
	mobile_number_confirmation_token text unique,
	mobile_number_confirmation_sent_at timestamp,
	mobile_number_confirmed_at timestamp,
	mobile_number_unconfirmed text, -- storage for a new phone number until its confirmed

	-- User Details
	zip_code text,
	gender smallint, -- 0: female, 1: male, 2: other
	ethnicity text,
	birth_date  date,
	physician_name text,
	physician_phone_number text,

	-- When did the user accept the terms and conditions?
	accepted_terms_at timestamp,
	-- When did the user review their account and say everything looks correct?
	reviewed_at timestamp,
	-- When did the user submit their first survey?
	first_survey_at timestamp,

	-- Tracking
	seen_at timestamp,
	sign_in_count integer,
	current_sign_in_at timestamp,
	last_sign_in_at timestamp,
	current_sign_in_ip text,
	last_sign_in_ip text,
	current_user_agent text,
	last_user_agent text,

	-- Timestamps
	created_at timestamp not null default now(),
	updated_at timestamp not null default now()
);

CREATE TRIGGER users_updated_at_moddatetime
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE moddatetime(updated_at);

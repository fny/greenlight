# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_11_15_233613) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cohorts", force: :cascade do |t|
    t.text "name", null: false
    t.text "category", null: false
    t.bigint "location_id", null: false
    t.bigint "created_by_id"
    t.bigint "updated_by_id"
    t.bigint "deleted_by_id"
    t.datetime "deleted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_cohorts_on_created_by_id"
    t.index ["deleted_by_id"], name: "index_cohorts_on_deleted_by_id"
    t.index ["location_id"], name: "index_cohorts_on_location_id"
    t.index ["updated_by_id"], name: "index_cohorts_on_updated_by_id"
  end

  create_table "cohorts_users", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "cohort_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["cohort_id"], name: "index_cohorts_users_on_cohort_id"
    t.index ["user_id"], name: "index_cohorts_users_on_user_id"
  end

  create_table "greenlight_statuses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "status", null: false
    t.date "submission_date", null: false
    t.date "expiration_date", null: false
    t.date "follow_up_date", null: false
    t.text "reason"
    t.text "logical_trace"
    t.boolean "is_override", default: false, null: false
    t.bigint "created_by_id"
    t.bigint "deleted_by_id"
    t.datetime "deleted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_greenlight_statuses_on_created_by_id"
    t.index ["deleted_by_id"], name: "index_greenlight_statuses_on_deleted_by_id"
    t.index ["status"], name: "index_greenlight_statuses_on_status"
    t.index ["user_id"], name: "index_greenlight_statuses_on_user_id"
  end

  create_table "location_accounts", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "location_id", null: false
    t.text "external_id"
    t.text "role", null: false
    t.text "permission_level"
    t.text "title"
    t.text "attendance_status"
    t.datetime "approved_by_user_at"
    t.datetime "approved_by_location_at"
    t.bigint "created_by_id"
    t.bigint "updated_by_id"
    t.bigint "deleted_by_id"
    t.datetime "deleted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_location_accounts_on_created_by_id"
    t.index ["deleted_by_id"], name: "index_location_accounts_on_deleted_by_id"
    t.index ["external_id"], name: "index_location_accounts_on_external_id", unique: true
    t.index ["location_id"], name: "index_location_accounts_on_location_id"
    t.index ["role"], name: "index_location_accounts_on_role"
    t.index ["updated_by_id"], name: "index_location_accounts_on_updated_by_id"
    t.index ["user_id"], name: "index_location_accounts_on_user_id"
  end

  create_table "locations", force: :cascade do |t|
    t.text "name", null: false
    t.text "category", null: false
    t.text "permalink", null: false
    t.text "phone_number"
    t.text "email"
    t.text "website"
    t.text "zip_code"
    t.boolean "hidden", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["permalink"], name: "index_locations_on_permalink", unique: true
  end

  create_table "medical_events", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "greenlight_status_id", null: false
    t.text "event_type", null: false
    t.datetime "occurred_at", null: false
    t.bigint "created_by_id"
    t.bigint "updated_by_id"
    t.bigint "deleted_by_id"
    t.datetime "deleted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_medical_events_on_created_by_id"
    t.index ["deleted_by_id"], name: "index_medical_events_on_deleted_by_id"
    t.index ["event_type"], name: "index_medical_events_on_event_type"
    t.index ["greenlight_status_id"], name: "index_medical_events_on_greenlight_status_id"
    t.index ["updated_by_id"], name: "index_medical_events_on_updated_by_id"
    t.index ["user_id"], name: "index_medical_events_on_user_id"
  end

  create_table "parents_children", force: :cascade do |t|
    t.bigint "parent_id", null: false
    t.bigint "child_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["child_id"], name: "index_parents_children_on_child_id"
    t.index ["parent_id"], name: "index_parents_children_on_parent_id"
  end

  create_table "password_resets", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.text "token"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_password_resets_on_user_id"
  end

  create_table "user_settings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.boolean "override_location_reminders", default: false, null: false
    t.text "daily_reminder_type", default: "text", null: false
    t.integer "daily_reminder_time", default: 7, null: false
    t.boolean "remind_mon", default: true, null: false
    t.boolean "remind_tue", default: true, null: false
    t.boolean "remind_wed", default: true, null: false
    t.boolean "remind_thu", default: true, null: false
    t.boolean "remind_fri", default: true, null: false
    t.boolean "remind_sat", default: true, null: false
    t.boolean "remind_sun", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_user_settings_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.text "first_name", default: "Greenlight User", null: false
    t.text "last_name", default: "Unknown", null: false
    t.text "password_digest"
    t.datetime "password_set_at"
    t.text "magic_sign_in_token"
    t.datetime "magic_sign_in_sent_at"
    t.text "auth_token"
    t.datetime "auth_token_set_at"
    t.text "email"
    t.text "email_confirmation_token"
    t.datetime "email_confirmation_sent_at"
    t.datetime "email_confirmed_at"
    t.text "email_unconfirmed"
    t.text "mobile_number"
    t.text "mobile_carrier"
    t.boolean "is_sms_emailable"
    t.text "mobile_number_confirmation_token"
    t.datetime "mobile_number_confirmation_sent_at"
    t.datetime "mobile_number_confirmed_at"
    t.text "mobile_number_unconfirmed"
    t.text "locale", default: "en", null: false
    t.text "zip_code"
    t.text "time_zone", default: "America/New_York"
    t.date "birth_date"
    t.text "physician_name"
    t.text "physician_phone_number"
    t.text "daily_reminder_type", default: "text", null: false
    t.boolean "needs_physician", default: false, null: false
    t.datetime "invited_at"
    t.datetime "completed_welcome_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.bigint "created_by_id"
    t.bigint "updated_by_id"
    t.bigint "deleted_by_id"
    t.datetime "deleted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["auth_token"], name: "index_users_on_auth_token", unique: true
    t.index ["created_by_id"], name: "index_users_on_created_by_id"
    t.index ["deleted_by_id"], name: "index_users_on_deleted_by_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["email_confirmation_token"], name: "index_users_on_email_confirmation_token", unique: true
    t.index ["magic_sign_in_token"], name: "index_users_on_magic_sign_in_token", unique: true
    t.index ["mobile_number"], name: "index_users_on_mobile_number", unique: true
    t.index ["mobile_number_confirmation_token"], name: "index_users_on_mobile_number_confirmation_token"
    t.index ["updated_by_id"], name: "index_users_on_updated_by_id"
  end

  add_foreign_key "cohorts", "locations", on_delete: :cascade
  add_foreign_key "cohorts", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "cohorts", "users", column: "deleted_by_id", on_delete: :nullify
  add_foreign_key "cohorts", "users", column: "updated_by_id", on_delete: :nullify
  add_foreign_key "cohorts_users", "cohorts", on_delete: :cascade
  add_foreign_key "cohorts_users", "users", on_delete: :cascade
  add_foreign_key "greenlight_statuses", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "greenlight_statuses", "users", column: "deleted_by_id", on_delete: :nullify
  add_foreign_key "greenlight_statuses", "users", on_delete: :cascade
  add_foreign_key "location_accounts", "locations", on_delete: :cascade
  add_foreign_key "location_accounts", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "location_accounts", "users", column: "deleted_by_id", on_delete: :nullify
  add_foreign_key "location_accounts", "users", column: "updated_by_id", on_delete: :nullify
  add_foreign_key "location_accounts", "users", on_delete: :cascade
  add_foreign_key "medical_events", "greenlight_statuses", on_delete: :cascade
  add_foreign_key "medical_events", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "medical_events", "users", column: "deleted_by_id", on_delete: :nullify
  add_foreign_key "medical_events", "users", column: "updated_by_id", on_delete: :nullify
  add_foreign_key "medical_events", "users", on_delete: :cascade
  add_foreign_key "parents_children", "users", column: "child_id", on_delete: :cascade
  add_foreign_key "parents_children", "users", column: "parent_id", on_delete: :cascade
  add_foreign_key "password_resets", "users", on_delete: :cascade
  add_foreign_key "user_settings", "users", on_delete: :cascade
  add_foreign_key "users", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "users", "users", column: "deleted_by_id", on_delete: :nullify
  add_foreign_key "users", "users", column: "updated_by_id", on_delete: :nullify
end

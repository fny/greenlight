# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_01_28_103252) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "cohorts", force: :cascade do |t|
    t.string "name", null: false
    t.string "category", null: false
    t.bigint "location_id", null: false
    t.bigint "created_by_id"
    t.bigint "updated_by_id"
    t.bigint "deleted_by_id"
    t.datetime "deleted_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "code", null: false
    t.index ["created_by_id"], name: "index_cohorts_on_created_by_id"
    t.index ["deleted_by_id"], name: "index_cohorts_on_deleted_by_id"
    t.index ["location_id", "category", "name"], name: "index_cohorts_on_location_id_and_category_and_name", unique: true
    t.index ["location_id", "code"], name: "index_cohorts_on_location_id_and_code", unique: true
    t.index ["location_id"], name: "index_cohorts_on_location_id"
    t.index ["updated_by_id"], name: "index_cohorts_on_updated_by_id"
  end

  create_table "cohorts_users", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "cohort_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["cohort_id", "user_id"], name: "index_cohorts_users_on_cohort_id_and_user_id", unique: true
    t.index ["cohort_id"], name: "index_cohorts_users_on_cohort_id"
    t.index ["user_id"], name: "index_cohorts_users_on_user_id"
  end

  create_table "greenlight_statuses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "status", null: false
    t.date "submission_date", null: false
    t.date "expiration_date", null: false
    t.date "follow_up_date", null: false
    t.string "reason"
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
    t.string "external_id"
    t.string "role", null: false
    t.string "permission_level"
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
    t.index ["location_id", "external_id"], name: "index_location_accounts_on_location_id_and_external_id", unique: true
    t.index ["location_id"], name: "index_location_accounts_on_location_id"
    t.index ["role"], name: "index_location_accounts_on_role"
    t.index ["updated_by_id"], name: "index_location_accounts_on_updated_by_id"
    t.index ["user_id"], name: "index_location_accounts_on_user_id"
  end

  create_table "locations", force: :cascade do |t|
    t.string "name", null: false
    t.string "category", null: false
    t.string "permalink", null: false
    t.string "phone_number"
    t.string "email"
    t.string "website"
    t.string "zip_code"
    t.boolean "hidden", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "daily_reminder_time", default: 7, null: false
    t.boolean "remind_mon", default: true, null: false
    t.boolean "remind_tue", default: true, null: false
    t.boolean "remind_wed", default: true, null: false
    t.boolean "remind_thu", default: true, null: false
    t.boolean "remind_fri", default: true, null: false
    t.boolean "remind_sat", default: true, null: false
    t.boolean "remind_sun", default: true, null: false
    t.integer "employee_count"
    t.datetime "approved_at"
    t.bigint "created_by_id"
    t.string "registration_code"
    t.string "registration_code_downcase"
    t.string "student_registration_code"
    t.string "student_registration_code_downcase"
    t.string "gdrive_staff_roster_id"
    t.string "gdrive_student_roster_id"
    t.jsonb "cohort_schema", default: {}, null: false
    t.boolean "reminders_enabled", default: true, null: false
    t.index ["created_by_id"], name: "index_locations_on_created_by_id"
    t.index ["permalink"], name: "index_locations_on_permalink", unique: true
  end

  create_table "medical_events", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "greenlight_status_id", null: false
    t.string "event_type", null: false
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
    t.index ["parent_id", "child_id"], name: "index_parents_children_on_parent_id_and_child_id", unique: true
    t.index ["parent_id"], name: "index_parents_children_on_parent_id"
  end

  create_table "password_resets", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "token"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_password_resets_on_user_id"
  end

  create_table "roster_imports", force: :cascade do |t|
    t.bigint "location_id", null: false
    t.string "category"
    t.bigint "created_by_id"
    t.string "status", default: "received"
    t.text "message", default: ""
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["created_by_id"], name: "index_roster_imports_on_created_by_id"
    t.index ["location_id"], name: "index_roster_imports_on_location_id"
  end

  create_table "survey_responses", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "survey_id", null: false
    t.string "response"
    t.string "medium"
    t.datetime "responded_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["survey_id", "user_id"], name: "index_survey_responses_on_survey_id_and_user_id", unique: true
    t.index ["survey_id"], name: "index_survey_responses_on_survey_id"
    t.index ["user_id"], name: "index_survey_responses_on_user_id"
  end

  create_table "surveys", force: :cascade do |t|
    t.string "question", null: false
    t.string "question_es"
    t.string "question_type", default: "choices", null: false
    t.jsonb "choices", default: {}
    t.jsonb "choices_es", default: {}
    t.jsonb "location_ids", default: []
    t.datetime "last_sent_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "permalink"
  end

  create_table "user_settings", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.boolean "override_location_reminders", default: false, null: false
    t.string "daily_reminder_type", default: "text", null: false
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
    t.string "first_name", default: "Greenlight User", null: false
    t.string "last_name", default: "Unknown", null: false
    t.string "password_digest"
    t.datetime "password_set_at"
    t.string "magic_sign_in_token"
    t.datetime "magic_sign_in_sent_at"
    t.string "auth_token"
    t.datetime "auth_token_set_at"
    t.string "email"
    t.string "email_confirmation_token"
    t.datetime "email_confirmation_sent_at"
    t.datetime "email_confirmed_at"
    t.string "email_unconfirmed"
    t.string "mobile_number"
    t.string "mobile_carrier"
    t.boolean "is_sms_emailable"
    t.string "mobile_number_confirmation_token"
    t.datetime "mobile_number_confirmation_sent_at"
    t.datetime "mobile_number_confirmed_at"
    t.string "mobile_number_unconfirmed"
    t.string "locale", default: "en", null: false
    t.string "zip_code"
    t.string "time_zone", default: "America/New_York"
    t.date "birth_date"
    t.string "physician_name"
    t.string "physician_phone_number"
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
    t.datetime "daily_reminder_sent_at"
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

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
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
  add_foreign_key "locations", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "medical_events", "greenlight_statuses", on_delete: :cascade
  add_foreign_key "medical_events", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "medical_events", "users", column: "deleted_by_id", on_delete: :nullify
  add_foreign_key "medical_events", "users", column: "updated_by_id", on_delete: :nullify
  add_foreign_key "medical_events", "users", on_delete: :cascade
  add_foreign_key "parents_children", "users", column: "child_id", on_delete: :cascade
  add_foreign_key "parents_children", "users", column: "parent_id", on_delete: :cascade
  add_foreign_key "password_resets", "users", on_delete: :cascade
  add_foreign_key "roster_imports", "locations", on_delete: :cascade
  add_foreign_key "roster_imports", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "user_settings", "users", on_delete: :cascade
  add_foreign_key "users", "users", column: "created_by_id", on_delete: :nullify
  add_foreign_key "users", "users", column: "deleted_by_id", on_delete: :nullify
  add_foreign_key "users", "users", column: "updated_by_id", on_delete: :nullify
end

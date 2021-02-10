class ChangeTextFieldsToString < ActiveRecord::Migration[6.0]
  def change
    change_column :locations, :name, :string
    change_column :locations, :category, :string
    change_column :locations, :permalink, :string
    change_column :locations, :phone_number, :string
    change_column :locations, :email, :string
    change_column :locations, :website, :string
    change_column :locations, :zip_code, :string

    change_column :users, :first_name, :string
    change_column :users, :last_name, :string
    change_column :users, :password_digest, :string
    change_column :users, :magic_sign_in_token, :string
    change_column :users, :auth_token, :string
    change_column :users, :email, :string
    change_column :users, :email_confirmation_token, :string
    change_column :users, :email_unconfirmed, :string
    change_column :users, :mobile_number, :string
    change_column :users, :mobile_carrier, :string
    change_column :users, :mobile_number_confirmation_token, :string
    change_column :users, :mobile_number_unconfirmed, :string
    change_column :users, :locale, :string
    change_column :users, :zip_code, :string
    change_column :users, :time_zone, :string
    change_column :users, :physician_name, :string
    change_column :users, :physician_phone_number, :string

    change_column :user_settings, :daily_reminder_type, :string

    change_column :password_resets, :token, :string

    change_column :medical_events, :event_type, :string

    change_column :cohorts, :name, :string
    change_column :cohorts, :category, :string

    change_column :greenlight_statuses, :status, :string
    change_column :greenlight_statuses, :reason, :string
  end
end

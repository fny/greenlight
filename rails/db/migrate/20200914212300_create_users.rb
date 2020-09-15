class CreateUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :users, id: :uuid do |t|
      t.text :first_name, null: false
      t.text :last_name, null: false
      t.text :password_digest
      t.timestamp :password_set_at
      t.text :password_reset_token, index: { unique: true}
      t.timestamp :password_reset_sent_at
      t.text :auth_token, index: { unique: true }, null: false
      t.timestamp :auth_token_set_at
      t.text :email, index: { unique: true}
      t.text :email_confirmation_token, index: { unique: true}
      t.timestamp :email_confirmation_sent_at
      t.timestamp :email_confirmed_at
      t.text :email_unconfirmed
      t.text :mobile_number, index: { unique: true}
      t.text :mobile_carrier
      t.boolean :is_sms_gateway_emailable
      t.text :mobile_number_confirmation_token, index: true
      t.timestamp :mobile_number_confirmation_sent_at
      t.timestamp :mobile_number_confirmed_at
      t.text :mobile_number_unconfirmed
      t.text :zip_code
      t.integer :gender, limit: 2
      t.text :ethnicity
      t.date :birth_date
      t.text :physician_name
      t.text :physician_phone_number
      t.timestamp :accepted_terms_at
      t.timestamp :reviewed_at
      t.timestamp :first_survey_at
      t.timestamp :seen_at
      t.integer :sign_in_count, default: 0, null: false
      t.timestamp :current_sign_in_at
      t.timestamp :last_sign_in_at
      t.inet :current_sign_in_ip
      t.inet :last_sign_in_ip
      t.text :current_user_agent
      t.text :last_user_agent

      t.timestamps
    end
  end
end

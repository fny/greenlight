# == Schema Information
#
# Table name: users
#
#  id                                 :uuid             not null, primary key
#  accepted_terms_at                  :datetime
#  auth_token                         :text             not null
#  auth_token_set_at                  :datetime
#  birth_date                         :date
#  current_sign_in_at                 :datetime
#  current_sign_in_ip                 :inet
#  current_user_agent                 :text
#  email                              :text
#  email_confirmation_sent_at         :datetime
#  email_confirmation_token           :text
#  email_confirmed_at                 :datetime
#  email_unconfirmed                  :text
#  ethnicity                          :text
#  first_name                         :text             not null
#  first_survey_at                    :datetime
#  gender                             :integer
#  is_sms_gateway_emailable           :boolean
#  last_name                          :text             not null
#  last_sign_in_at                    :datetime
#  last_sign_in_ip                    :inet
#  last_user_agent                    :text
#  mobile_carrier                     :text
#  mobile_number                      :text
#  mobile_number_confirmation_sent_at :datetime
#  mobile_number_confirmation_token   :text
#  mobile_number_confirmed_at         :datetime
#  mobile_number_unconfirmed          :text
#  password_digest                    :text
#  password_reset_sent_at             :datetime
#  password_reset_token               :text
#  password_set_at                    :datetime
#  physician_name                     :text
#  physician_phone_number             :text
#  reviewed_at                        :datetime
#  seen_at                            :datetime
#  sign_in_count                      :integer          default(0), not null
#  zip_code                           :text
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#
# Indexes
#
#  index_users_on_mobile_number_confirmation_token  (mobile_number_confirmation_token)
#
Fabricator(:user) do
  first_name { Faker::Name.first_name }
  last_name { Faker::Name.last_name }
  email { Faker::Internet.unique.email }
  mobile_number { Faker::PhoneNumber.unique.cell_phone_in_e164 }
  password 'super_secret_password'
end

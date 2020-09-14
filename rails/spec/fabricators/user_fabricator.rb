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
  first_name                         "MyText"
  last_name                          "MyText"
  password                           "MyText"
  password_reset_token               "MyText"
  password_reset_sent_at             "2020-09-14 17:23:00"
  auth_token                         "MyText"
  auth_token_set_at                  "2020-09-14 17:23:00"
  email                              "MyText"
  email_confirmation_token           "MyText"
  email_confirmation_sent_at         "2020-09-14 17:23:00"
  email_confirmed_at                 "2020-09-14 17:23:00"
  email_unconfirmed                  "MyText"
  mobile_number                      "MyText"
  mobile_carrier                     "MyText"
  is_sms_gateway_emailable           false
  mobile_number_confirmation_token   "MyText"
  mobile_number_confirmation_sent_at "2020-09-14 17:23:00"
  mobile_number_confirmed_at         "2020-09-14 17:23:00"
  mobile_number_unconfirmed          "MyText"
  zip_code                           "MyText"
  gender                             ""
  ethnicity                          "MyText"
  birth_date                         "2020-09-14"
  physician_name                     "MyText"
  physician_phone_number             "MyText"
  accepted_terms_at                  "2020-09-14 17:23:00"
  reviewed_at                        "2020-09-14 17:23:00"
  first_survey_at                    "2020-09-14 17:23:00"
  seen_at                            "2020-09-14 17:23:00"
  sign_in_count                      1
  current_sign_in_at                 "2020-09-14 17:23:00"
  last_sign_in_at                    "2020-09-14 17:23:00"
  current_sign_in_ip                 "MyText"
  last_sign_in_ip                    "MyText"
  current_user_agent                 "MyText"
  last_user_agent                    "MyText"
end

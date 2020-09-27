# == Schema Information
#
# Table name: users
#
#  id                                 :uuid             not null, primary key
#  accepted_terms_at                  :datetime
#  auth_token                         :text
#  auth_token_set_at                  :datetime
#  birth_date                         :date
#  completed_welcome_at               :datetime
#  current_sign_in_at                 :datetime
#  current_sign_in_ip                 :inet
#  daily_reminder_type                :text             default("text")
#  email                              :text
#  email_confirmation_sent_at         :datetime
#  email_confirmation_token           :text
#  email_confirmed_at                 :datetime
#  email_unconfirmed                  :text
#  first_name                         :text             default("Greenlight User"), not null
#  is_sms_emailable                   :boolean
#  language                           :text             default("en"), not null
#  last_name                          :text             default("Unknown"), not null
#  last_sign_in_at                    :datetime
#  last_sign_in_ip                    :inet
#  magic_sign_in_sent_at              :datetime
#  magic_sign_in_token                :text
#  mobile_carrier                     :text
#  mobile_number                      :text
#  mobile_number_confirmation_sent_at :datetime
#  mobile_number_confirmation_token   :text
#  mobile_number_confirmed_at         :datetime
#  mobile_number_unconfirmed          :text
#  password_digest                    :text
#  password_set_at                    :datetime
#  physician_name                     :text
#  physician_phone_number             :text
#  sign_in_count                      :integer          default(0), not null
#  zip_code                           :text
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#
# Indexes
#
#  index_users_on_auth_token                        (auth_token) UNIQUE
#  index_users_on_email                             (email) UNIQUE
#  index_users_on_email_confirmation_token          (email_confirmation_token) UNIQUE
#  index_users_on_magic_sign_in_token               (magic_sign_in_token) UNIQUE
#  index_users_on_mobile_number                     (mobile_number) UNIQUE
#  index_users_on_mobile_number_confirmation_token  (mobile_number_confirmation_token)
#
class UserSerializer < ApplicationSerializer
  attribute :first_name
  attribute :last_name
  attribute :email
  attribute :mobile_number
  attribute :physician_name
  attribute :physician_phone_number
  attribute :zip_code
  attribute :accepted_terms_at
  attribute :completed_welcome_at

  has_many :location_accounts
  has_one :last_greenlight_status, serializer: GreenlightStatusSerializer, record_type: 'greenlightStatus'

  # has_many :parents
  # has_many :cohorts
  # has_many :greelight_statuses
  # has_many :medical_events
  # has_many :recent_greelight_statuses
  # has_many :recent_medical_events
end

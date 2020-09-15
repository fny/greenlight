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
#  index_users_on_auth_token                        (auth_token) UNIQUE
#  index_users_on_email                             (email) UNIQUE
#  index_users_on_email_confirmation_token          (email_confirmation_token) UNIQUE
#  index_users_on_mobile_number                     (mobile_number) UNIQUE
#  index_users_on_mobile_number_confirmation_token  (mobile_number_confirmation_token)
#  index_users_on_password_reset_token              (password_reset_token) UNIQUE
#
class User < ApplicationRecord
  
  has_many :parent_relationships, foreign_key: :child_user_id,
           class_name: 'ParentChild'
  has_many :children, through: :parent_relationships,
           source: :parent_user
  has_many :child_relationships, foreign_key: :parent_user_id,
           class_name: 'ParentChild'
  has_many :parents, through: :child_relationships,
           source: :child_user

  has_many :greenlight_statuses
  has_many :medical_events
  has_many :location_accounts
  has_many :locations, through: :location_accounts
  has_many :cohorts, through: :cohort_user
  
  has_secure_token :auth_token
  has_secure_password
end

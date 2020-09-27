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
class User < ApplicationRecord
  extend Enumerize

  enumerize :daily_reminder_type, in: [:text, :email, :none]

  has_many :parent_relationships, foreign_key: :child_user_id,
           class_name: 'ParentChild'
  has_many :parents, through: :parent_relationships,
           source: :parent_user
  has_many :child_relationships, foreign_key: :parent_user_id,
           class_name: 'ParentChild'
  has_many :children, through: :child_relationships,
           source: :child_user

  has_many :greenlight_statuses
  has_many :medical_events
  has_many :location_accounts
  has_many :locations, through: :location_accounts
  has_many :cohorts, through: :cohort_user

  has_one :todays_greenlight_status, -> { submitted_today }, class_name: 'GreenlightStatus'
  has_one :last_greenlight_status, -> { order('created_at') }, class_name: 'GreenlightStatus'

  has_many :recent_greenlight_statuses, -> { recently_created }, class_name: 'GreenlightStatus'
  has_many :recent_medical_events, -> { recently_created }, class_name: 'MedicalEvent'

  has_secure_password
  has_secure_token :auth_token
  has_secure_token :magic_sign_in_token

  validates :language, inclusion: { in: %w[en es] }
  validates :email, 'valid_email_2/email': true, uniqueness: true, allow_nil: true
  validates :mobile_number, phone: { countries: :us }, allow_nil: true, uniqueness: true

  validates :password, length: { minimum: 8 }, allow_blank: true

  validates :first_name, presence: true
  validates :first_name, presence: true
  validate :email_or_mobile_number_present

  before_save :format_mobile_number

  def self.find_by_email_or_mobile(value)
    email_or_mobile = value.kind_of?(EmailOrPhone) ? value : EmailOrPhone.new(value)
    if email_or_mobile.email?
      User.find_by(email: email_or_mobile.value)
    elsif email_or_mobile.phone?
      User.find_by(mobile_number: email_or_mobile.value)
    end
  end

  def full_name
    "#{self.first_name} #{self.last_name}"
  end

  def name_with_email
    "\"#{full_name}\" <#{email}>"
  end

  def save_sign_in!(ip)
    self.last_sign_in_ip = self.current_sign_in_ip
    self.current_sign_in_ip = ip
    self.last_sign_in_at = Time.now
    self.sign_in_count += 1
    save!
  end

  def reset_auth_token!
    regenerate_auth_token
    self.auth_token_set_at = Time.now
    save!
  end

  def reset_magic_sign_in_token!
    regenerate_magic_sign_in_token
    self.magic_sign_in_sent_at = Time.now
    save!
  end

  def magic_sign_in_url(remember_me = false)
    if remember_me
      "#{Greenlight::SHORT_URL}/mgk/#{magic_sign_in_token}/y"
    else
      "#{Greenlight::SHORT_URL}/mgk/#{magic_sign_in_token}/n"
    end
  end

  def parent_of?(child_user)
    children.include?(child_user)
  end

  def child_of?(parent_user)
    parents.include?(parent_user)
  end

  def authorized_to_view?(user)
    parent_of?(user) || user == self
  end

  def authorized_to_edit?(user)
    parent_of?(user) || user == self
  end

  def admin?
    false
  end

  before_save :timestamp_password

  private

  def email_or_mobile_number_present
    if !email? && !mobile_number?
      errors.add(:base, 'email or mobile number required')
    end
  end

  def timestamp_password
    if password_digest_changed?
      self.password_set_at = Time.now
    end
  end
    
  def format_mobile_number
    self.mobile_number = Phonelib.parse(mobile_number, 'US').full_e164    
  end
end

class User < ApplicationRecord
  extend Enumerize
  extend Memoist

  enumerize :daily_reminder_type, in: [:text, :email, :none]
  enumerize :time_zone, in: ActiveSupport::TimeZone.all.map { |x| x.tzinfo.name }, default: 'America/New_York'

  # [
  #   'America/New_York',
  #   'America/Chicago',
  #   'America/Denver',
  #   'America/Los_Angeles'
  # ]

  # in: {
  #   eastern: 'America/New_York',
  #   central: 'America/Chicago',
  #   mountain: 'America/Denver',
  #   pacific: 'America/Los_Angeles'
  # }

  has_many :parent_relationships, foreign_key: :child_id,
           class_name: 'ParentChild'
  has_many :parents, through: :parent_relationships,
           source: :parent
  has_many :child_relationships, foreign_key: :parent_id,
           class_name: 'ParentChild'
  has_many :children, through: :child_relationships,
           source: :child

  has_many :greenlight_statuses
  has_many :medical_events
  has_many :location_accounts
  has_many :locations, through: :location_accounts
  has_many :cohorts, through: :cohort_user

  has_one :todays_greenlight_status, -> { submitted_for_today }, class_name: 'GreenlightStatus'
  has_one :last_greenlight_status, -> { order('created_at DESC') }, class_name: 'GreenlightStatus'

  has_many :recent_greenlight_statuses, -> { recently_created }, class_name: 'GreenlightStatus'
  has_many :recent_medical_events, -> { recently_created }, class_name: 'MedicalEvent'

  has_secure_password validations: false
  has_secure_token :auth_token
  has_secure_token :magic_sign_in_token

  validates :locale, inclusion: { in: GreenlightX::SUPPORTED_LOCALES }
  validates :email, 'valid_email_2/email': true, uniqueness: true, allow_nil: true
  validates :mobile_number, phone: { countries: :us }, allow_nil: true, uniqueness: true

  validates :password, length: { minimum: 8 }, allow_blank: true

  validates :first_name, presence: true
  validates :first_name, presence: true

  before_save :format_mobile_number
  before_save :timestamp_password

  memoize def admin_at?(location)
    location_accounts.where(location_id: location.id, permission_level: :admin).exists?
  end

  def self.find_by_email_or_mobile(value)
    email_or_mobile = value.kind_of?(EmailOrPhone) ? value : EmailOrPhone.new(value)
    if email_or_mobile.email?
      User.find_by(email: email_or_mobile.value)
    elsif email_or_mobile.phone?
      User.find_by(mobile_number: email_or_mobile.value)
    end
  end

  def inferred_greenlight_status
    return todays_greenlight_status if todays_greenlight_status
    if last_greenlight_status && !last_greenlight_status.expired?
      return last_greenlight_status
    end
    GreenlightStatus.new(
      user: self,
      status: GreenlightStatus::UNKNOWN
    )
  end

  def recent_cleared_override
    greenlight_statuses.order('created_at DESC').where(is_override: true).where('submission_date >= ?', 14.days.ago).first
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

  def admin?
    %w[
      faraz.yashar@gmail.com
      josephbwebb@gmail.com
      mark.sendak@duke.edu
      april.warren@studentudurham.org
      amy.salo@studentudurham.org
      cameron.phillips@studentudurham.org
      daniela.sanchez@studentudurham.org
      ray.starn@studentudurham.org
      kellane.kornegay@studentudurham.org
      feyth.scott@studentudurham.org
      madelyn.srochi@studentudurham.org
      bryanna.ray@studentudurham.org
      emmanuel.lee@studentudurham.org
    ].include?(self.email)
  end


  def authorized_to_view?(user)
    admin? || parent_of?(user) || user == self
  end

  def authorized_to_edit?(user)
    admin? || parent_of?(user) || user == self
  end

  def submitted_for_today?
    last_greenlight_status.today?
  end

  def needs_to_sumbit_survey_for
    submits_surveys_for.filter { |u| !u.submitted_for_today? }
  end

  def needs_to_sumbit_survey_for_text
    needs_to_sumbit_survey_for.map(&:first_name).to_sentence
  end

  def mobile_number=(value)
    return if value.blank?
    parsed = Phonelib.parse(value, 'US').full_e164
    parsed = nil if parsed.blank?
    self[:mobile_number] = parsed
  end

  # PERF: N+1 query
  def submits_surveys_for
    people = []
    if location_accounts.any?
      people.push(self)
    end
    children.each do |c|
      if c.location_accounts.any?
        people.push(self)
      end
    end
  end

  def submits_surveys_for_text
    submits_surveys_for.map(&:first_name).to_sentence
  end

  def destroy_all_associated_statuses
    ActiveRecord::Base.transaction do
      greenlight_statuses.destroy_all
      children.each do |child|
        child.greenlight_statuses.destroy_all
      end
    end
  end

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
    return if mobile_number.blank?
    parsed = Phonelib.parse(mobile_number, 'US').full_e164
    parsed = nil if parsed.blank?
    self.mobile_number = parsed
  end
end

# == Schema Information
#
# Table name: users
#
#  id                                 :bigint           not null, primary key
#  accepted_terms_at                  :datetime
#  auth_token                         :text
#  auth_token_set_at                  :datetime
#  birth_date                         :date
#  completed_invite_at                :datetime
#  current_sign_in_at                 :datetime
#  current_sign_in_ip                 :inet
#  daily_reminder_type                :text             default("text"), not null
#  deleted_at                         :datetime
#  email                              :text
#  email_confirmation_sent_at         :datetime
#  email_confirmation_token           :text
#  email_confirmed_at                 :datetime
#  email_unconfirmed                  :text
#  first_name                         :text             default("Greenlight User"), not null
#  invited_at                         :datetime
#  is_sms_emailable                   :boolean
#  last_name                          :text             default("Unknown"), not null
#  last_sign_in_at                    :datetime
#  last_sign_in_ip                    :inet
#  locale                             :text             default("en"), not null
#  magic_sign_in_sent_at              :datetime
#  magic_sign_in_token                :text
#  mobile_carrier                     :text
#  mobile_number                      :text
#  mobile_number_confirmation_sent_at :datetime
#  mobile_number_confirmation_token   :text
#  mobile_number_confirmed_at         :datetime
#  mobile_number_unconfirmed          :text
#  needs_physician                    :boolean          default(FALSE), not null
#  password_digest                    :text
#  password_set_at                    :datetime
#  physician_name                     :text
#  physician_phone_number             :text
#  sign_in_count                      :integer          default(0), not null
#  time_zone                          :text
#  zip_code                           :text
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  created_by_id                      :bigint
#  deleted_by_id                      :bigint
#  updated_by_id                      :bigint
#
# Indexes
#
#  index_users_on_auth_token                        (auth_token) UNIQUE
#  index_users_on_created_by_id                     (created_by_id)
#  index_users_on_deleted_by_id                     (deleted_by_id)
#  index_users_on_email                             (email) UNIQUE
#  index_users_on_email_confirmation_token          (email_confirmation_token) UNIQUE
#  index_users_on_magic_sign_in_token               (magic_sign_in_token) UNIQUE
#  index_users_on_mobile_number                     (mobile_number) UNIQUE
#  index_users_on_mobile_number_confirmation_token  (mobile_number_confirmation_token)
#  index_users_on_updated_by_id                     (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (deleted_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (updated_by_id => users.id) ON DELETE => nullify
#

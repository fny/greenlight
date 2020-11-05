# frozen_string_literal: true

# TODO: Incorporate these into this model.
#
# hasNotSubmittedOwnSurvey
# hasNotSubmittedOwnSurveyForTomorrow
# usersNotSubmitted
# usersNotSubmittedForTomorrow
# hasLocationThatRequiresSurvey
# needsToSubmitSomeonesSurvey

class User < ApplicationRecord
  extend Enumerize
  extend Memoist

  TIME_ZONES = ActiveSupport::TimeZone.all.map { |x| x.tzinfo.name }
  DAILY_REMINDER_TYPES = [
    TEXT = 'text',
    EMAIL = 'email',
    NONE = 'none'
  ]
  enumerize :daily_reminder_type, in: DAILY_REMINDER_TYPES
  enumerize :time_zone, in: TIME_ZONES, default: 'America/New_York'

  # @!attribute [rw]
  # Users relationships as a child to other users
  has_many :child_relationships,
           foreign_key: :child_id,
           class_name: 'ParentChild',
           inverse_of: :child

  has_many :parent_relationships,
           foreign_key: :parent_id,
           class_name: 'ParentChild',
           inverse_of: :parent

  has_many :parents,
           through: :child_relationships,
           source: :parent

  has_many :children,
           through: :parent_relationships,
           source: :child

  has_many :greenlight_statuses
  has_many :medical_events, inverse_of: :user
  has_many :location_accounts, inverse_of: :user
  has_many :locations, through: :location_accounts
  has_many :cohorts, through: :cohort_user

  self.permitted_params = %i[
    first_name last_name email password mobile_number mobile_carrier locale
    zip_code time_zone birth_date physician_name physician_phone_number
    daily_reminder_type needs_physician
  ]

  # Last Greenlight statuse submitted by the user
  has_one :last_greenlight_status,
          -> { order('created_at DESC') },
          class_name: 'GreenlightStatus',
          inverse_of: :user

  has_secure_password validations: false
  has_secure_token :auth_token
  has_secure_token :magic_sign_in_token

  validates :locale, inclusion: { in: Greenlight::SUPPORTED_LOCALES }
  validates :email, 'valid_email_2/email': true, uniqueness: true, allow_nil: true
  validates :mobile_number, phone: { countries: :us }, allow_nil: true, uniqueness: true

  validates :password, length: { minimum: 8 }, allow_blank: true

  validates :first_name, presence: true
  validates :first_name, presence: true

  before_save :format_mobile_number
  before_save :timestamp_password

  before_save { self.email&.downcase! }

  def self.create_account!(
    first_name:, last_name:, password:, location:, role:,
    email: nil, mobile_number: nil, permission_level: 'none'
  )
    ActiveRecord::Base.transaction do
      u = User.create!(
        first_name: first_name,
        last_name: last_name,
        email: email,
        mobile_number: mobile_number,
        password: password
      )

      l = Location.find_by_id_or_permalink!(location)

      LocationAccount.create!(
        user_id: u.id,
        location: l,
        role: role,
        permission_level: permission_level
      )
    end
  end

  def self.faraz
    find_by(email: 'faraz.yashar@gmail.com')
  end

  # @param [EmailOrPhone, String] value
  def self.find_by_email_or_mobile(value)
    email_or_mobile = value.is_a?(EmailOrPhone) ? value : EmailOrPhone.new(value)
    if email_or_mobile.email?
      User.find_by(email: email_or_mobile.value)
    elsif email_or_mobile.phone?
      User.find_by(mobile_number: email_or_mobile.value)
    end
  end

  # Todays status
  def inferred_status
    return last_greenlight_status if last_greenlight_status && !last_greenlight_status.expired?

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
    self.last_sign_in_at = Time.zone.now
    self.sign_in_count += 1
    save!
  end

  def reset_auth_token!
    regenerate_auth_token
    self.auth_token_set_at = Time.zone.now
    save!
  end

  def reset_magic_sign_in_token!
    regenerate_magic_sign_in_token
    self.magic_sign_in_sent_at = Time.zone.now
    save!
  end


  def needs_to_submit_survey_for
    submits_surveys_for.filter { |u| !u.submitted_for_today? }
  end

  def needs_to_submit_survey_for_text
    needs_to_submit_survey_for.map(&:first_name).to_sentence
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
    people.push(self) if location_accounts.any?
    children.each do |c|
      people.push(self) if c.location_accounts.any?
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

  def magic_sign_in_url(remember_me: false)
    if remember_me
      "#{Greenlight::SHORT_URL}/mgk/#{magic_sign_in_token}/y"
    else
      "#{Greenlight::SHORT_URL}/mgk/#{magic_sign_in_token}/n"
    end
  end

  # @param [Location] location
  def admin_at?(location)
    location_accounts.exists?(location_id: location.id, permission_level: LocationAccount::ADMIN)
  end

  # @param [User] child_user
  def parent_of?(child_user)
    children.include?(child_user)
  end

  # @param [User] parent_user
  def child_of?(parent_user)
    parents.include?(parent_user)
  end

  def superuser?
    email == 'faraz.yashar@gmail.com'
  end

  # @param [User] user
  def admin_of?(user)
    raise(ArgumentError, "#{user.class} is not a User") unless user.is_a?(User)

    DB.query_single(<<~SQL.squish, admin_id: self.id, user_id: user.id).any?
      select 1
      from (
        select
          location_id
        from
          location_accounts
        where
          user_id = :admin_id
          and permission_level = 'admin'
        intersect
        select
          location_id
        from
          location_accounts
        where
          user_id = :user_id
      ) as t
      limit 1
    SQL
  end

  # @param [User] user
  def authorized_to_view?(user)
    user == self || admin_of?(user) || parent_of?(user) || superuser?
  end

  # @param [User] user
  def authorized_to_edit?(user)
    user == self || admin_of?(user) || parent_of?(user) || superuser?
  end

  def submitted_for_today?
    last_greenlight_status.today?
  end

  private

  def email_or_mobile_number_present
    return unless email? || mobile_number?

    errors.add(:base, 'email or mobile number required')
  end

  def timestamp_password
    return unless password_digest_changed?

    self.password_set_at = Time.now
  end

  def format_mobile_number
    return if mobile_number?

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
#  first_name                         :text             default("Greenlight User"), not null
#  last_name                          :text             default("Unknown"), not null
#  password_digest                    :text
#  password_set_at                    :datetime
#  magic_sign_in_token                :text
#  magic_sign_in_sent_at              :datetime
#  auth_token                         :text
#  auth_token_set_at                  :datetime
#  email                              :text
#  email_confirmation_token           :text
#  email_confirmation_sent_at         :datetime
#  email_confirmed_at                 :datetime
#  email_unconfirmed                  :text
#  mobile_number                      :text
#  mobile_carrier                     :text
#  is_sms_emailable                   :boolean
#  mobile_number_confirmation_token   :text
#  mobile_number_confirmation_sent_at :datetime
#  mobile_number_confirmed_at         :datetime
#  mobile_number_unconfirmed          :text
#  locale                             :text             default("en"), not null
#  zip_code                           :text
#  time_zone                          :text             default("America/New_York")
#  birth_date                         :date
#  physician_name                     :text
#  physician_phone_number             :text
#  daily_reminder_type                :text             default("text"), not null
#  needs_physician                    :boolean          default(FALSE), not null
#  invited_at                         :datetime
#  completed_invite_at                :datetime
#  sign_in_count                      :integer          default(0), not null
#  current_sign_in_at                 :datetime
#  last_sign_in_at                    :datetime
#  current_sign_in_ip                 :inet
#  last_sign_in_ip                    :inet
#  created_by_id                      :bigint
#  updated_by_id                      :bigint
#  deleted_by_id                      :bigint
#  deleted_at                         :datetime
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
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

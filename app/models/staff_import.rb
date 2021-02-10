# frozen_string_literal: true

# Importing a single staff member. If the external_id already exists,
# the corresponding User and LocationAccount will have their values overwritten.
#
class StaffImport
  include ActiveAttr::Model

  UnhandledCase = Class.new(StandardError)
  InvalidState = Class.new(StandardError)

  # LocationAccount related
  attribute :external_id, type: String
  attribute :role, type: String
  attribute :permission_level, type: String

  # User related
  attribute :first_name, type: String
  attribute :last_name, type: String
  attribute :email, type: String
  attribute :mobile_number, type: String
  attribute :location # type Location
  attribute :cohorts # type Array[String] of cohort codes

  # LocationAccount related
  validates :external_id, presence: true
  validates :role, presence: true

  # User related
  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :mobile_number, phone: { countries: :us }, allow_nil: true
  validates :email, 'valid_email_2/email': true, allow_nil: true

  validate :email_or_mobile_number_present
  validate :external_id_isnt_decimal

  def user
    return @user if defined?(@user)

    @user = location_account.user
    @user ||= User.find_by(email: email&.downcase&.strip) if email.present?
    @user ||= User.find_by(mobile_number: PhoneNumber.parse(mobile_number)) if mobile_number.present?
    @user ||= User.new
    @user.assign_attributes(
      first_name: first_name&.strip,
      last_name: last_name&.strip,
      email: email&.downcase&.strip,
      mobile_number: mobile_number&.strip
    )
    @user
  end

  def location_account
    return @la if defined?(@la)

    @la = LocationAccount.find_by(location: location, external_id: external_id) || LocationAccount.new()
    @la.assign_attributes(
      external_id: external_id.strip.downcase,
      location_id: location.id,
      role: role&.strip&.downcase,
      permission_level: permission_level&.strip&.downcase
    )
    @la
  end

  # rubocop:disable all
  def save!
    return false unless valid?
    # Case 1: Everything already exists in the DB
    if user&.persisted? && location_account&.persisted?
      return persist!
    end

    # Case 2: The users location account does not exist
    if user&.persisted? && !location_account&.persisted?
      location_account.user = user
      return persist!
    end

    # Case 3: The user does not exist but the location account does
    if !user&.persisted? && location_account&.persisted?
      raise InvalidState
    end

    # Case 4: Nothing is persisted for this user
    if !user&.persisted? && !location_account&.persisted?
      location_account.user = user
      return persist!
    end

    raise UnhandledCase, "Unhandled case error: user #{user&.persisted?} account #{location_account&.persisted?}"
  end

  # rubocop:enable all
  def assign_cohorts
    user_cohort_ids = Set.new(user.cohorts.pluck(:id))
    user_location_cohort_ids = Set.new(user.cohorts.where(location: location).pluck(:id))
    assigned_cohort_ids = Set.new(Cohort.where(location: location, code: cohorts).pluck(:id))
    updated_cohort_ids = (user_cohort_ids - user_location_cohort_ids + assigned_cohort_ids)
    user.cohort_ids = updated_cohort_ids
  end

  private

  # Excel will return numbers formatted as scientific numbers sometimes.
  # This catches that.
  def external_id_isnt_decimal
    return unless external_id
    return unless external_id.include?('.')

    errors.add(:external_id, "can't look like a decimal")
  end

  def email_or_mobile_number_present
    if mobile_number.blank? && email.blank?
      errors.add(:base, 'email or mobile number must be present')
    end
  end

  def persist!
    ActiveRecord::Base.transaction do
      assign_cohorts
      user.save!
      location_account.save!
    end
    user
  end
end

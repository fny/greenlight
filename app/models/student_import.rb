class StudentImport
  include ActiveAttr::Model

  UnhandledCase = Class.new(StandardError)
  InvalidState = Class.new(StandardError)

  attribute :first_name, type: String
  attribute :last_name, type: String
  attribute :external_id, type: String
  attribute :parent1_first_name, type: String
  attribute :parent1_last_name, type: String
  attribute :parent1_email, type: String
  attribute :parent1_mobile_number, type: String
  attribute :parent2_first_name, type: String
  attribute :parent2_last_name, type: String
  attribute :parent2_email, type: String
  attribute :parent2_mobile_number, type: String
  attribute :location # type Location
  attribute :cohorts # type Array<String>

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :external_id, presence: true

  validate :parent1_email_or_mobile_number_present
  validate :external_id_isnt_decimal

  def child_location_account
    return @child_location_account if defined?(@child_location_account)

    @child_location_account = LocationAccount.find_by(external_id: external_id) || LocationAccount.new(
      external_id: external_id,
      location_id: location.id,
      role: LocationAccount::STUDENT,
      permission_level: LocationAccount::NONE
    )
  end

  def child
    return @child if defined?(@child)

    if child_location_account.persisted?
      @child ||= child_location_account.user
    end

    @child ||= User.new
    @child.assign_attributes(
      first_name: first_name || @child.first_name,
      last_name: last_name || @child.last_name
    )
    @child
  end

  def parent1
    return @parent1 if defined?(@parent1)

    @parent1 ||= User.find_by(email: parent1_email&.downcase&.strip) if parent1_email.present?
    @parent1 ||= User.find_by(mobile_number: PhoneNumber.parse(parent1_mobile_number)) if parent1_mobile_number.present?
    @parent1 ||= User.new
    @parent1.assign_attributes(
      first_name: parent1_first_name.presence || @parent1.first_name || 'Greenlight User',
      last_name: parent1_last_name.presence || @parent1.last_name || 'Unknown',
      email: parent1_email,
      mobile_number: parent1_mobile_number
    )
    @parent1
  end

  def parent2
    return nil if parent2_email.blank? && parent2_mobile_number.blank?
    return @parent2 if defined?(@parent2)

    @parent2 ||= User.find_by(email: parent2_email&.downcase&.strip) if parent2_email.present?
    @parent2 ||= User.find_by(mobile_number: PhoneNumber.parse(parent2_mobile_number)) if parent2_mobile_number.present?
    @parent2 ||= User.new
    @parent2.assign_attributes(
      first_name: parent2_first_name.presence || @parent2.first_name || 'Greenlight User',
      last_name: parent2_last_name.presence || @parent2.last_name || 'Unknown',
      email: parent2_email,
      mobile_number: parent2_mobile_number
    )
    @parent2
  end

  def save_child_with_one_parent!
    parent = parent1
    # Case 1: Everyone already exists in the DB
    if parent.persisted? && child.persisted? && child_location_account.persisted?
      return persist!
    end

    # Case 2: The childs location account does not exist
    if parent.persisted? && child.persisted? && !child_location_account.persisted?
      raise InvalidState # This isn't possible
    end

    # Case 3: The parent is persisted, but the child isn't
    if parent.persisted? && !child.persisted?
      # # Location account should not exist in this case
      raise InvalidState if child_location_account.persisted?

      child_location_account.user = child
      return persist!
    end

    # Case 4: The parent isn't, but the child is
    if !parent.persisted? && child.persisted?
      # Location account should exist in this case
      raise InvalidState unless child_location_account.persisted?
      return persist!
    end

    # Case 5: Neither the parent nor the child are persisted
    if !parent.persisted? && !child.persisted?
      # There should be no location account in this case
      raise InvalidState if child_location_account.persisted?

      child_location_account.user = child
      return persist!
    end

    raise UnhandledCase
  end

  def save_child_with_two_parents!
    # Case 1: Everyone already exists in the DB
    if parent1.persisted? && parent2.persisted? && child.persisted? && child_location_account.persisted?
      return persist!
    end

    # Case 2: Parent 2 isn't persisted
    if parent1.persisted? && !parent2.persisted? && child.persisted? && child_location_account.persisted?
      return persist!
    end

    # Case 2: The childs location account does not exist
    if child.persisted? && !child_location_account.persisted?
      raise InvalidState # This isn't possible
    end

    # Case 3: The parent is persisted, but the child isn't
    if parent1.persisted? && parent2.persisted? && !child.persisted?
      # Location account should not exist in this case
      raise InvalidState if child_location_account.persisted?

      child_location_account.user = child
      return persist!
    end

    # Case 4: The parent isn't, but the child is
    if (!parent1.persisted? || !parent2.persisted?) && child.persisted?
      # Location account should exist in this case
      raise InvalidState unless child_location_account.persisted?
      return persist!
    end

    # Case 5: Neither the parent nor the child are persisted
    if (!parent1.persisted? || !parent2.persisted?) && !child.persisted? && !child_location_account.persisted?
      # There should be no location account in this case
      raise InvalidState if child_location_account.persisted?

      child_location_account.user = child
      return persist!
    end

    raise UnhandledCase
  end

  def two_parents?
    parent2_email.present? || parent2_mobile_number.present?
  end

  # rubocop:disable all
  def save!
    # TODO: THERE'S AN ISSUE IF THERE ARE MIXED PARENTS
    # Say a father has registered their son somewhere in one location
    # but then in another location the mother registers the same child
    # a new child would end up being created that's not the same child.

    return false unless valid?

    if two_parents?
      save_child_with_two_parents!
    else
      save_child_with_one_parent!
    end

  end
  # rubocop:enable all

  private

  # Excel will return numbers formatted as scientific numbers sometimes.
  # This catches that.
  def external_id_isnt_decimal
    return unless external_id
    return unless external_id.include?('.')

    errors.add(:external_id, "can't look like a decimal")
  end

  def parent1_email_or_mobile_number_present
    if parent1_mobile_number.blank? && parent1_email.blank?
      errors.add(:base, 'email or mobile number must be present for at least one parent')
    end
  end

  def assign_cohorts
    user_cohort_ids = Set.new(child.cohorts.pluck(:id))
    user_location_cohort_ids = Set.new(child.cohorts.where(location: location).pluck(:id))
    assigned_cohort_ids = Set.new(Cohort.where(location: location, code: cohorts).pluck(:id))
    updated_cohort_ids = (user_cohort_ids - user_location_cohort_ids + assigned_cohort_ids)
    child.cohort_ids = updated_cohort_ids
  end

  def persist!
    ActiveRecord::Base.transaction do
      assign_cohorts
      child.save!
      child_location_account.save!
      parent1.children << child
      if two_parents?
        parent2.save!
        parent2.children << child

      end
    end
    child
  end
end

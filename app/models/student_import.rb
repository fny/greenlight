class StudentImport
  include ActiveAttr::Model

  UnhandledCase = Class.new(StandardError)
  InvalidState = Class.new(StandardError)

  attribute :first_name, type: String
  attribute :last_name, type: String
  attribute :external_id, type: String
  attribute :parent_first_name, type: String
  attribute :parent_last_name, type: String
  attribute :parent_email, type: String
  attribute :parent_mobile_number, type: String
  attribute :location # type Location
  attribute :cohorts # type Hash{String => Array<String>}

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :external_id, presence: true
  # validates :parent_mobile_number, presence: true

  def child
    return @child if defined?(@child)

    if child_location_account.persisted?
      @child ||= child_location_account.user
    end

    if parent
      @child ||= parent.children.find_by(first_name: first_name, last_name: last_name)
      return @child if @child
    end

    @child ||= User.new
    @child.assign_attributes(first_name: first_name, last_name: last_name)
    @child
  end

  def child_location_account
    return @la if defined?(@la)

    @la = LocationAccount.find_by(external_id: external_id) || LocationAccount.new(
      external_id: external_id,
      location_id: location.id,
      role: LocationAccount::STUDENT
    )
  end

  def parent
    return @parent if defined?(@parent)

    @parent = User.find_by_email_or_mobile(parent_email) || User.find_by_email_or_mobile(parent_mobile_number) || User.new
    @parent.assign_attributes(
      first_name: parent_first_name || 'Greenlight User',
      last_name: parent_last_name || 'Unknown',
      email: parent_email,
      # mobile_number: parent_mobile_number.blank? ? nil : parent_mobile_number
    )
    @parent
  end

  # rubocop:disable all
  def save!
    # TODO: THERE'S AN ISSUE IF THERE ARE MIXED PARENTS
    # Say a father has registered their son somewhere in one location
    # but then in another location the mother registers the same child
    # a new child would end up being created that's not the same child.

    return false unless valid?

    # Case 1: Everyone already exists in the DB
    if parent.persisted? && child.persisted? && child_location_account.persisted?
      return save_all!
    end

    # Case 2: The childs location account does not exist
    if parent.persisted? && child.persisted? && !child_location_account.persisted?
      child_location_account.user = child
      return save_all!
    end

    # Case 3: The parent is persisted, but the child isn't
    if parent.persisted? && !child.persisted?
      # Location account should not exist in this case
      raise InvalidState if child_location_account.persisted?

      child_location_account.user = child
      return save_all!
    end

    # Case 4: The parent isn't, but the child is
    if !parent.persisted? && child.persisted?
      # Location account should exist in this case
      raise InvalidState unless child_location_account.persisted?
      return save_all!
    end

    # Case 5: Neither the parent nor the child are persisted
    if !parent.persisted? && !child.persisted?
      # There should be no location account in this case
      raise InvalidState if child_location_account.persisted?

      child_location_account.user = child
      return save_all!
    end

    raise UnhandledCase
  end
  # rubocop:enable all

  private

  def save_all!
    ActiveRecord::Base.transaction do
      # binding.pry if parent.email == 'shelley@alimfamily.com'

      parent.save! && child.save! && child_location_account.save!
      # child_cohort_ids = child.cohorts.pluck(:id)
      # new_cohorts = Cohort.find_or_create_cohorts!(location, cohorts).filter { |c|
      #   !child_cohort_ids.include?(c.id)
      # }
      # child.cohorts << new_cohorts
    end
    child
  end
end

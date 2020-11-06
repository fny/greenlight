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

  attribute :cohorts # type Hash

  validates :first_name, presence: true
  validates :last_name, presence: true
  validates :external_id, presence: true
  validates :parent_mobile_number, presence: true

  def child
    return @child if defined?(@child)

    if child_location_account.persisted?
      @child = child_location_account.user
      return @child
    end

    if parent
      @child = parent.children.where(first_name: first_name, last_name: last_name).first
      return @child if @child
    end
    @child = User.new(
      first_name: first_name,
      last_name: last_name,
    )
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

    @parent = User.find_by_email_or_mobile(parent_mobile_number || parent_email) || User.new(
      first_name: parent_first_name || 'Greenlight User',
      last_name: parent_last_name || 'Unknown',
      email: parent_email,
      mobile_number: parent_mobile_number
    )
  end

  # rubocop:disable all
  def save!
    # TODO: THERE'S AN ISSUE IF THERE ARE MIXED PARENTS
    # Say a father has registered there son somewhere in one location
    # but then in another location the mother registers the same child
    # a new child would end up being created that's not the same child.

    return false unless valid?

    if parent.persisted? && child.persisted? && child_location_account.persisted?
      return true
    end

    if parent.persisted? && child.persisted? && !child_location_account.persisted?
      child_location_account.user = child
      return child_location_account.save!
    end

    if parent.persisted? && !child.persisted?
      # Location account should not exist in this case
      raise InvalidState if child_location_account.persisted?

      child_location_account.user = child
      return child.save! && child_location_account.save!
    end

    if !parent.persisted? && child.persisted?
      # Location account should exist in this case
      raise InvalidState unless child_location_account.persisted?
      return parent.save!
    end

    if !parent.persisted? && !child.persisted?
      # There should be no location account in this case
      raise InvalidState if child_location_account.persisted?

      child_location_account.user = child
      return parent.save! && child.save! && child_location_account.save!
    end

    raise UnhandledCase
  end
  # rubocop:enabke all
end

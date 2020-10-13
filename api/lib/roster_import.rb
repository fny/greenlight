class RosterImport
  HEADERS = [
    UID = "Unique Id*",
    SFIRST = "Student First Name*",
    SLAST = "Student Last Name*",
    SBDATE = "Student Birth Date",
    P1FIRST = "Parent 1 First Name*",
    P1LAST = "Parent 1 Last Name*",
    P1EMAIL = "Parent 1 Email",
    P1PHONE = "Parent 1 Mobile Number*",
    P2FIRST = "Parent 2 First Name",
    P2LAST = "Parent 2 Last Name",
    P2EMAIL = "Parent 2 Email",
    P2PHONE = "Parent 2 Mobile Number"
  ]
  def initialize(location, path)
    @location = location.is_a?(Location) ? location : Location.find_by_id_or_permalink!(location)

    @sheet = Creek::Book.new(path).sheets[0]


    if HEADERS != @sheet.rows.first.values
      raise "Invalid spreadsheet provided. Got #{@sheet.rows.first.values}."
    end
  end

  def process_rows!
    ActiveRecord::Base.transaction do
      @sheet.rows.map { |raw_row| Row.new(Hash[HEADERS.zip(raw_row.values)], @location) }.each_with_index do |r, i|
        next if r.raw_data[UID] == UID # Skip the first header row
        next if r.raw_data.values.all?(&:nil?)
        r.process!
        if r.errors.any?
          puts "Row #{i}\n#{r.raw_data}\n - Errors: #{r.errors}\n - Notes: #{r.notes}"
          raise "IMPORT ERRORS!"
        end
      end
    end
  end
  class RosterImport::Row
    def child_id
      @r[RosterImport::UID]
    end
  end
  class Row
    attr_reader :notes, :errors, :location, :raw_data

    def initialize(row_hash, location)
      @location = location
      @raw_data = @r = row_hash
      @notes = []
      @errors = []
    end

    def validate_required_fields_present
      @errors.push("'#{UID}' Missing") if @r[UID].blank?
      @errors.push("'#{SFIRST}' Missing") if @r[SFIRST].blank?
      @errors.push("'#{SLAST}' Missing") if @r[SLAST].blank?
      # @errors.push("'#{P1FIRST}' Missing") if @r[P1FIRST].blank?
      # @errors.push("'#{P1LAST}' Missing") if @r[P1LAST].blank?
      @errors.push("'#{P1PHONE}' Missing") if @r[P1PHONE].blank?
    end

    def child
      @child ||= User.new(first_name: @r[SFIRST], last_name: @r[SLAST])
    end

    def child_location_account
      @child_la ||= LocationAccount.find_by(external_id: @r[UID]) || LocationAccount.new(
        external_id: @r[UID],
        location_id: @location.id,
        role: 'student',
        permission_level: 'none'
      )
    end

    def parent1
      return @parent1 if defined?(@parent1)
      email = @r[P1EMAIL]
      phone = @r[P1PHONE]
      @parent1 = User.where(email: email).or(User.where(mobile_number: EmailOrPhone.new(phone).value)).first || User.new
      @parent1.assign_attributes(
        first_name: @r[P1FIRST] || 'Greenlight User',
        last_name: @r[P1LAST] || 'Unknown',
        email: email,
        mobile_number: phone)
      @parent1
    end

    def process!
      validate_required_fields_present
      return if @errors.any?
      if child_location_account.persisted?
        existing_user = child_location_account.user
        if child.full_name == existing_user.full_name
          @notes.push("User found with external id #{child_location_account.external_id}")
        else
          @errors.push("Different user found with external id #{child_location_account.external_id} #{existing_user.full_name}")
          return
        end
        @child = existing_user
      end

      if parent1.id && child.id && ParentChild.where(parent_id: parent1.id, child_id: child.id).exists?
        @notes.push("Parent and child already related")
      end

      if !child_location_account.persisted?
        child.location_accounts << child_location_account
        child.save!
      end
      parent1.save
      parent1.children << child

      parent1.save!
    rescue => e
      puts e.message
      puts errors
      raise "ERRORS!!"
    end
  end
end

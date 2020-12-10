# frozen_string_literal: true
class OldStaffImport
  HEADERS = [
    UID = "Unique Id*",
    FIRST = "First Name (or Alias)*",
    LAST = "Last Name (or Alias)*",
    EMAIL = "Email*",
    PHONE = "Mobile Number*",

    # TITLE = "Title",
    PERMISSION = "Permission Level",
    ROLE = "Role",
  ].freeze

  def initialize(location, path)
    @location = location.is_a?(Location) ? location : Location.find_by_id_or_permalink!(location)

    @sheet = Creek::Book.new(path).sheets[0]
    if HEADERS != @sheet.rows.first.values
      raise "Invalid spreadsheet provided. Got #{@sheet.rows.first.values} expected #{HEADERS}.\nDiff #{HEADERS - @sheet.rows.first.values}"
    end
  end

  def process_rows!
    ActiveRecord::Base.transaction do
      @sheet.rows.map { |raw_data| Row.new(Hash[HEADERS.zip(raw_data.values)], @location) }.each_with_index do |r, i|
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
      @errors.push("'#{FIRST}' Missing") if @r[FIRST].blank?
      @errors.push("'#{LAST}' Missing") if @r[LAST].blank?
      @errors.push("'#{EMAIL}' Missing") if @r[EMAIL].blank? &&  @r[PHONE].blank?
      @errors.push("'#{PHONE}' Missing") if @r[EMAIL].blank? &&  @r[PHONE].blank?
      @errors.push("'#{ROLE}' Missing") if @r[ROLE].blank?
    end

    def user
      return @user if defined?(@user)
      @email = (@r[EMAIL] || '').downcase.strip
      @phone = (@r[PHONE] || '').strip
      @query = User.where(email: @email)
      @query = @query.or(User.where(mobile_number: @phone)) if @phone
      @user = @query.first || User.new
      @user.assign_attributes(first_name: @r[FIRST], last_name: @r[LAST], email: @email, mobile_number: @phone)
      @user
    end

    def location_account
      @la ||= LocationAccount.find_by(external_id: @r[UID], location_id: @location.id) || LocationAccount.new(
        external_id: @r[UID],
        location_id: @location.id,
        role: @r[ROLE].downcase.strip,
        permission_level: @r[PERMISSION].downcase.strip
      )
    end

    def process!

      validate_required_fields_present
      return if @errors.any?

      if location_account.persisted?
        puts "existing #{user.email}"
        existing_user = location_account.user
        location_account.assign_attributes(
          role: @r[ROLE].downcase.strip,
          permission_level: @r[PERMISSION].downcase.strip
        )
        existing_user.assign_attributes(first_name: @r[FIRST], last_name: @r[LAST], email: @email, mobile_number: @phone)
        location_account.save!
        existing_user.save!
        return
      end
      puts user.email
      location_account.user = user
      user.save!
      location_account.save!
    rescue => e
      binding.pry
      puts e.message
      puts location_account.attributes
      puts errors
      raise "ERRORS!!"
    end
  end
end

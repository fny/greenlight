# frozen_string_literal: true
class ImportStudentRoster < ApplicationCommand
  argument :gdrive_id
  argument :location

  validates :gdrive_id, presence: true
  validates :location, presence: true

  CORE_COLUMNS = [
    UID = 'Unique Id',
    FIRST = 'Student First Name',
    LAST = 'Student Last Name',
    EMAIL = 'Parent Email',
    MOBILE = 'Parent Mobile',
  ].freeze

  COHORT_PREFIX = '#'
  COHORT_DELIMITER = ';'

  def row_value(row, columns, key, i)
    row["#{columns[key]}#{i + 1}"]
  end

  # @param row
  # @returns [Hash] { "Category" => ["Cohort A", "Cohort B"] }
  def row_cohort_value(row, columns, i)
    columns.transform_values { |v|
      (row["#{v}#{i + 1}"] || '').split(COHORT_DELIMITER)
    }
  end


  # @params [ActiveModel::Errors]
  def process_errors(import)
    h = import.errors.to_h
    [h, import.attributes.slice(*h.keys().map(&:to_s))]
  end

  def work
    begin
      file_path = Greenlight::Data.fetch_gdrive(gdrive_id, 'xlsx')
      sheet = Creek::Book.new(file_path).sheets[0]
      header_row = sheet.rows.first

      # Build core column mapping
      # e.g. { "First Name" => "A" }
      core_columns = {}
      core_headers = header_row.filter { |k, v| !(v || '').starts_with?(COHORT_PREFIX) }
      core_headers.each do |cell_id, value|
        column_title, score = CORE_COLUMNS.zip(CORE_COLUMNS.map { |c|
        begin
          JaroWinkler.distance(c, value)
        rescue
          0
        end

        }).max_by { |c| c[1] }

        if score < 0.8
          puts "Score too low (#{score}) for #{column_title} vs seen #{value}"
          next
        end

        # Strip number out e.g. A1 => A
        core_columns[column_title] = cell_id.gsub(/\d/, '')
      end

      # Build cohort column mapping
      # e.g. { "Class Room" => "B" }
      cohort_columns = header_row.select { |_, v| (v || '').starts_with?(COHORT_PREFIX) }
        .transform_values { |v| v.tr('#', '') }
        .invert.transform_values { |v| v.gsub(/\d/, '') }
    rescue => e
      error = { message: "#{e.class}, #{e.message}", backtrace: e.backtrace}
      error.delete(:backtrace) if Rails.env.production? # || Rails.env.development?
      return error
    end

    errors = {}

    # ActiveRecord::Base.transaction do
      sheet.rows.each_with_index do |row, i|
        next if i == 0
        next if row.values.all?(&:blank?)
        next if row_value(row, core_columns, EMAIL, i).blank?

        import = StudentImport.new(
          external_id: row_value(row, core_columns, UID, i),
          role: 'student',
          permission_level: 'none',
          first_name: row_value(row, core_columns, FIRST, i),
          last_name: row_value(row, core_columns, LAST, i),
          parent_first_name: 'Greenlight User',
          parent_last_name: 'Unknown',
          parent_mobile_number: row_value(row, core_columns, MOBILE, i),
          parent_email: row_value(row, core_columns, EMAIL, i),
          cohorts: row_cohort_value(row, cohort_columns, i),
          location: location
        )
        if import.valid?
          import.save!
        else
          errors[i] = process_errors(import)
        end
      rescue => e
        errors[i] = { message: e.message, backtrace: e.backtrace}
        errors[i].delete(:backtrace) if Rails.env.production? # || Rails.env.development?
      end
    # end
    errors
  end
end

# frozen_string_literal: true
class ImportStudentRoster < ApplicationCommand
  argument :gdrive_id
  argument :location

  validates :gdrive_id, presence: true
  validates :location, presence: true

  CORE_COLUMNS = [
    UID = 'Unique Id',
    FIRST = 'First Name',
    LAST = 'Last Name',
    EMAIL = 'Email',
    MOBILE = 'Mobile Number',
    PERM = 'Permission Level',
    ROLE = 'Role',
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
      core_headers = header_row.filter { |k, v| !v.starts_with?('#') }; true
      core_headers.each do |cell_id, value|
        column_title, score = CORE_COLUMNS.zip(CORE_COLUMNS.map { |c| JaroWinkler.distance(c, value) }).max_by { |c| c[1] }

        raise("Score too low (#{score}) for #{column_title} vs seen #{value}") if score < 0.8

        # Strip number out e.g. A1 => A
        core_columns[column_title] = cell_id.gsub(/\d/, '')
      end

      # Build cohort column mapping
      # e.g. { "Class Room" => "B" }
      cohort_columns = header_row.select { |_, v| v.starts_with?(COHORT_PREFIX) }
        .transform_values { |v| v.tr('#', '') }
        .invert.transform_values { |v| v.gsub(/\d/, '') }
    rescue => e
      error = { message: e.message, backtrace: e.backtrace}
      error.delete(:backtrace) if Rails.env.production?
      return error
    end

    errors = {}

    ActiveRecord::Base.transaction do
      sheet.rows.each_with_index do |row, i|
        next if i == 0
        next if row.values.all?(&:blank?)

        import = StaffImport.new(
          external_id: row_value(row, core_columns, UID, i),
          role: row_value(row, core_columns, ROLE, i),
          permission_level: row_value(row, core_columns, PERM, i),
          first_name: row_value(row, core_columns, FIRST, i),
          last_name: row_value(row, core_columns, LAST, i),
          mobile_number: row_value(row, core_columns, MOBILE, i),
          email: row_value(row, core_columns, EMAIL, i),
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
        errors[i].delete(:backtrace) if Rails.env.production?
      end
    end
    errors
  end
end

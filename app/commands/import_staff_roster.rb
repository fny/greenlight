# frozen_string_literal: true
class ImportStaffRoster < ApplicationCommand
  COHORT_PREFIX = '#'
  COHORT_DELIMITER = ';'
  SAVE_BACKTRACE = false

  argument :location
  argument :spreadsheet_path
  argument :dry_run
  argument :overwrite
  argument :created_by

  validates :location, presence: true

  # Returns the index of important headers for the import
  # @return [Hash<Symbol, Integer>]
  def attr_indexes(headers)
    hs = headers.map { |h| (h || '').downcase }
    {
      external_id: hs.find_index { |h| h.include?('unique') && h.include?('id')},
      role: hs.find_index { |h| h.include?('role') },
      permission_level: hs.find_index { |h| h.include?('perm') },
      first_name: hs.find_index { |h| h.include?('first') },
      last_name: hs.find_index { |h| h.include?('last') },
      mobile_number: hs.find_index { |h| h.include?('mobile') },
      email: hs.find_index { |h| h.include?('email') }
    }
  end

  # Extracts the cohorts for a given row in a roster file.
  #
  # @param [Array<String>] headers all the headers
  # @param [Array<String>] values the row values
  #
  # @return [Array<String>] [ "cat1:cohort_a", "cat1:cohort_b", "cat2:cohort_a" ]
  def extract_cohorts(headers, row)
    cohorts = []
    headers.each_with_index do |h, i|
      next unless h.present? && h.start_with?('#')

      (row[i] || '' ).split(COHORT_DELIMITER).each do |name|
        cohorts << Cohort.format_code(h, name)
      end
    end
    cohorts
  end

  def work
    import = RosterImport.new(location: location, category: 'staff', created_by: created_by)
    import.message << "Dry run!\n" if dry_run
    import.message << "Overwrite!\n" if overwrite

    if spreadsheet_path
      begin
        sheet = Creek::Book.new(spreadsheet_path).sheets[0]
      rescue => e
        import.message << "Couldn't load spreadsheet from provided path, make sure its an Excel file. #{e.message}\n"
        import.status = :failed
        import.save
        return import
      end
    elsif location.gdrive_staff_roster_id
      begin
        file_path = Greenlight::Data.fetch_gdrive(location.gdrive_staff_roster_id, 'xlsx')
        # import.roster.attach(io: File.open(file_path), filename: "#{location.gdrive_staff_roster_id}.xlsx")
        sheet = Creek::Book.new(file_path).sheets[0]
      rescue => e
        import.message << "Couldn't download spreadsheet, make sure its an Excel file that is shared with a public link. #{e.message}\n"
        import.status = :failed
        import.save
        return import
      end
    else
      import.message << 'No Google Drive ID provided for the staff roster\n'
      import.status = :failed
      import.save
      return import
    end

    headers = sheet.rows.first.values

    header_indexes = attr_indexes(headers)

    errors = []

    header_indexes.each do |k, v|
      next if v

      errors.push("#{k} header missing")
    end

    cohort_headers = headers.select { |x| x&.start_with?(COHORT_PREFIX) }
    cohort_headers.each do |cohort|
      errors.push("invalid cohort category #{cohort}") unless location.valid_cohort_category?(cohort)
    end

    if errors.any?
      import.message << errors.join("\n") << "\n"
      import.status = :failed
      import.save
      return import
    end

    ActiveRecord::Base.transaction do
      sheet.rows.each_with_index do |row, i|
        next if i.zero?
        next if row.values.all?(&:blank?)

        attrs = header_indexes.transform_values { |hi| row.values[hi] }
        attrs[:cohorts] = extract_cohorts(headers, row.values)
        attrs[:location] = location

        staff_import = StaffImport.new(attrs)
        if staff_import.valid?
          account_exists = LocationAccount.exists?(location: location, external_id: staff_import.external_id)
          if account_exists && !overwrite
            import.message << "Row #{i} with ID #{staff_import.external_id} already exists, skipping.\n"
          elsif LocationAccount.exists?(location: location, external_id: staff_import.external_id) && overwrite
            staff_import.save!
            import.message << "Row #{i} with ID #{staff_import.external_id} exists, overwriting.\n"
          else
            staff_import.save!
            import.message << "Row #{i} with ID #{staff_import.external_id} saved.\n"
          end
        else
          import.message << "Row #{i} with ID #{staff_import.external_id} had errors.\n"
          import.message << staff_import.errors.to_json << "\n"
          import.status = :failed
        end
      rescue => e
        import.message << "Row #{i} crashed.\n"
        import.message << e.message << "\n"
        import.message << e.backtrace.join("\n") if SAVE_BACKTRACE
        import.status = :failed
      end
      raise(ActiveRecord::Rollback) if import.status == :failed || dry_run
    end

    unless import.status == :failed
      import.status = :succeeded
    end
    import.save
    import
  end
end

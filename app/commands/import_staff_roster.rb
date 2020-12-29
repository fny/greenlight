# frozen_string_literal: true
class ImportStaffRoster < ApplicationCommand
  argument :location
  argument :dry_run
  argument :overwrite
  argument :created_by

  validates :location, presence: true

  COHORT_PREFIX = '#'
  COHORT_DELIMITER = ';'


  def find_uid_index(headers)
    headers.find_index { |h|
      h.downcase.include?('unique') && h.downcase.include?('id')
    }
  end

  def find_first_index(headers)
    headers.find_index { |h|
      h.downcase.include?('first') && h.downcase.include?('name')
    }
  end

  def find_last_index(headers)
    headers.find_index { |h|
      h.downcase.include?('last') && h.downcase.include?('name')
    }
  end

  def find_email_index(headers)
    headers.find_index { |h|
      h.downcase.include?('email')
    }
  end

  def find_mobile_index(headers)
    headers.find_index { |h|
      h.downcase.include?('mobile')
    }
  end

  def find_perm_index(headers)
    headers.find_index { |h|
      h.downcase.include?('perm')
    }
  end

  def find_role_index(headers)
    headers.find_index { |h|
      h.downcase.include?('role')
    }
  end

  # <Description>
  #
  # @param [Array<String>] headers all the headers
  # @param [Array<String>] cohort_headers the headers prefixed with '#'
  # @param [Array<String>] values the values for the given cohort category
  #
  # @return [Hash] { "Category" => ["Cohort A", "Cohort B"] }
  def extract_cohorts(headers, cohort_headers, values)
    cohorts = {}
    cohort_headers.each do |h|
      cohorts[h.tr('#', '')] = values[headers.find_index { |header| header == h }].split(COHORT_DELIMITER)
    end
    cohorts
  end

  def work
    import = RosterImport.new(location: location, category: 'staff', created_by: created_by)
    import.message << "Dry run!\n" if dry_run
    import.message << "Overwrite!\n" if overwrite
    unless location.gdrive_staff_roster_id
      import.message << 'No Google Drive ID provided for the staff roster\n'
      import.status = :failed
      import.save
      return import
    end

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
    headers = sheet.rows.first.values

    # Check the headers for any issues
    errors = []
    errors.push('unique id header missing') unless find_uid_index(headers)
    errors.push('first name header missing') unless find_first_index(headers)
    errors.push('last name header missing') unless find_last_index(headers)
    errors.push('email header missing') unless find_email_index(headers)
    errors.push('mobile header missing') unless find_mobile_index(headers)
    errors.push('permission level header missing') unless find_perm_index(headers)
    errors.push('role header missing') unless find_role_index(headers)

    cohort_headers = headers.select { |x| x&.start_with?(COHORT_PREFIX) }
    cohort_headers.each do |cohort|
      errors.push("invalid cohort #{cohort}") unless location.valid_cohort_category?(cohort)
    end

    if errors.any?
      import.message << errors.join("\n") << "\n"
      import.status = 'error'
      import.save
      return import
    end

    ActiveRecord::Base.transaction do
      sheet.rows.each_with_index do |row, i|
        next if i.zero?
        next if row.values.all?(&:blank?)

        staff_import = StaffImport.new(
          external_id: row.values[find_uid_index(headers)],
          role: row.values[find_role_index(headers)],
          permission_level: row.values[find_perm_index(headers)],
          first_name: row.values[find_first_index(headers)],
          last_name: row.values[find_last_index(headers)],
          mobile_number: row.values[find_mobile_index(headers)],
          email: row.values[find_email_index(headers)],
          cohorts: extract_cohorts(headers, cohort_headers, row.values),
          location: location
        )
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
        # import.message << e.backtrace.join("\n") if Rails.env.development?
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

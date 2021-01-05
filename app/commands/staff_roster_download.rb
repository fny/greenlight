# frozen_string_literal: true

class StaffRosterDownload < ApplicationCommand
  argument :permalink

  UID = 'Unique Id*'
  FIRST = 'First Name (or Alias)*'
  LAST = 'Last Name (or Alias)*'
  EMAIL = 'Email'
  MOBILE = 'Mobile Number'
  PERM = 'Permission Level'
  ROLE = 'Role'
  COMMON_HEADERS = [
    UID, FIRST, LAST, EMAIL, MOBILE, PERM, ROLE
  ].freeze

  def file_path
    Rails.root.join("tmp/#{permalink}--staff.xlsx")
  end

  def work
    location = Location.find_by!(permalink: permalink)
    accounts = location.location_accounts.where.not(role: 'student').includes(:user)
    cohort_categories = (location.cohort_schema.is_a?(String) ? JSON.parse(location.cohort_schema) : location.cohort_schema).keys
    headers = COMMON_HEADERS + cohort_categories.map { |k| "##{k.titleize}" }
    FileUtils.rm_f(file_path) if File.exist?(file_path)
    workbook = FastExcel.open(file_path)

    bold = workbook.bold_format
    worksheet = workbook.add_worksheet('Staff Roster')

    worksheet.append_row(headers, bold)
    accounts.each do |a|
      row = [a.external_id, a.user.first_name, a.user.last_name, a.user.email, a.user.mobile_number, a.permission_level, a.role]
      cohort_categories.each do |c|
        row << a.user.cohorts.where(location: location, category: c).pluck(:name).join(';')
      end
      worksheet.append_row(row)
    end
    workbook.close
    file_path
  end
end

# frozen_string_literal: true

class StudentRosterDownload < ApplicationCommand
  argument :permalink

  UID = 'Unique Id*'
  FIRST = 'Student First Name (or Alias)*'
  LAST = 'Student Last Name (or Alias)*'
  P1FIRST = 'Guardian 1 First Name'
  P1LAST = 'Guardian 1 Last Name'
  P1EMAIL = 'Guardian 1 Email'
  P1MOBILE = 'Guardian 1 Mobile'
  P2FIRST = 'Guardian 2 First Name'
  P2LAST = 'Guardian 2 Last Name'
  P2EMAIL = 'Guardian 2 Email'
  P2MOBILE = 'Guardian 2 Mobile'

  COMMON_HEADERS = [
    UID, FIRST, LAST, P1FIRST, P1LAST, P1EMAIL, P1MOBILE, P2FIRST, P2LAST, P2EMAIL, P2MOBILE
  ].freeze

  def file_path
    Rails.root.join("tmp/#{permalink}--students.xlsx")
  end

  def work
    location = Location.find(permalink)
    accounts = location.location_acccounts.where(role: 'student').includes(:users)
    cohort_categories = location.cohort_schema.keys
    headers = COMMON_HEADERS + cohort_categories.map { |k| "##{k.titleize}" }
    workbook = FastExcel.open(file_path, constant_memory: true)

    bold = workbook.bold_format
    worksheet = workbook.add_worksheet('Student Roster')

    worksheet.append_row(headers, bold)
    accounts.each do |a|
      row = [a.external_id, a.user.first, a.user.last]
      parents = a.user.parents
      parents[0, 2].each do |p|
        row += [p.first_name, p.last_name, p.email, p.mobile_number]
      end

      cohort_categories.each do |c|
        row << a.user.cohorts.where(location: location, category: c).pluck(:name).join(';')
      end
      worksheet.append_row(row)
    end
    workbook.close
    file_path
  end
end

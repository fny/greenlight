# frozen_string_literal: true

class UsersDownload < ApplicationCommand
  def file_path
    Rails.root.join("tmp/users.xlsx")
  end

  def work
    headers = ['First Name', 'Last Name', 'Email', 'Mobile Number']
    FileUtils.rm_f(file_path) if File.exist?(file_path)
    workbook = FastExcel.open(file_path, constant_memory: true)

    bold = workbook.bold_format
    worksheet = workbook.add_worksheet('Users')

    worksheet.append_row(headers, bold)
    User.in_batches do |users|
      users.each do |u|
        row = [u.first_name, u.last_name, u.email, u.mobile_number]
        worksheet.append_row(row)
      end
    end

    workbook.close
    file_path
  end
end

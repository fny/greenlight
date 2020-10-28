# frozen_string_literal: true
Faker::Config.locale = 'en-US'

Fabricator(:user) do
  first_name { Faker::Name.first_name }
  last_name { Faker::Name.last_name }
  time_zone { ActiveSupport::TimeZone.all.map { |x| x.tzinfo.name }.sample }
  email { Faker::Internet.unique.email }
  mobile_number {
    number = ''
    while !Phonelib.parse(number, 'US').valid?
      number = Faker::PhoneNumber.cell_phone_in_e164[3, 10]
    end
    Phonelib.parse(number, 'US').full_e164
  }
  password 'super_secret_password'
end

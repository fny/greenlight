Faker::Config.locale = 'en-US'

Fabricator(:user) do
  first_name { Faker::Name.first_name }
  last_name { Faker::Name.last_name }
  time_zone { ActiveSupport::TimeZone.all.map { |x| x.tzinfo.name }.sample }
  email { Faker::Internet.unique.email }
  mobile_number { Faker::PhoneNumber.unique.cell_phone_in_e164[1..-1] }
  password 'super_secret_password'
end

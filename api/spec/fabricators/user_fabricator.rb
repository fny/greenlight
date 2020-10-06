Faker::Config.locale = 'en-US'

Fabricator(:user) do
  first_name { Faker::Name.first_name }
  last_name { Faker::Name.last_name }
  email { Faker::Internet.unique.email }
  mobile_number { Faker::PhoneNumber.unique.cell_phone_in_e164[1..-1] }
  password 'super_secret_password'
end

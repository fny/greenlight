# frozen_string_literal: true
Faker::Config.locale = 'en-US'

Fabricator(:user) do
  first_name { Faker::Name.first_name }
  last_name { Faker::Name.last_name }
  time_zone { ActiveSupport::TimeZone.all.map { |x| x.tzinfo.name }.sample }
  email { Faker::Internet.unique.email }
  mobile_number {
    number = ''
    number = Faker::PhoneNumber.cell_phone_in_e164[3, 10] until PhoneNumber.valid?(number)

    Phonelib.parse(number, 'US').full_e164
  }
  password 'super_secret_password'
end

Fabricator(:child, from: :user) do
  location_accounts {
    Fabricate(
      :location_account,
      location: Fabricate(:location),
      role: LocationAccount::STUDENT
    ) do
      external_id { Faker::Internet.uuid }
    end
  }
end

Fabricator(:parent_with_two_children, from: :user) do
  children {
    [ Fabricate(:child), Fabricate(:child) ]
  }
end

# frozen_string_literal: true
Fabricator(:location) do
  name         "MyText"
  permalink    { Faker::Internet.unique.domain_word }
  phone_number {
    number = Faker::PhoneNumber.cell_phone_in_e164[2, 10] until PhoneNumber.valid?(number)
    PhoneNumber.parse(number)
  }
  email        "help@school.edu"
  category     "school"
  website      "MyText"
  zip_code     "MyText"
  hidden       false
end

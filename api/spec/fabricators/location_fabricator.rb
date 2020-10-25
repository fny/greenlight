Fabricator(:location) do
  name         "MyText"
  permalink    { Faker::Internet.unique.domain_word }
  phone_number {
    number = ''
    while !Phonelib.parse(number, 'US').valid?
      number = Faker::PhoneNumber.cell_phone_in_e164[3, 10]
    end
    Phonelib.parse(number, 'US').full_e164
  }
  email        "help@school.edu"
  category     "school"
  website      "MyText"
  zip_code     "MyText"
  hidden       false
end

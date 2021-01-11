# frozen_string_literal: true
Fabricator(:location) do
  name         { Faker::Company.name }
  permalink    { Faker::Internet.unique.domain_word }
  category     { Location::CATEGORIES.sample }
  phone_number { PhoneNumber.random_number }
  email        { |l| Faker::Internet.email(name: l[:name]) }
  website      { Faker::Internet.url }
  zip_code     { Faker::Address.zip }
end

Fabricator(:greenlight_academy, from: :location) {
  name 'Greenlight Academy'
  category 'school'
  permalink 'greenlight-academy'
  phone_number '302-316-0303'
  website 'https://greenlighted.org'
  zip_code '19703'
  hidden false
  cohort_schema do
    {
      'Team' => %w[Ed Business],
      'Timezone' => %w[EST CST MST PST],
      'Education' => %w[undergrad professional medstudent]
    }
  end
}

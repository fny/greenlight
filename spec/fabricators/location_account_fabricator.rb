# frozen_string_literal: true
Fabricator(:location_account) do
  external_id             { Faker::Internet.unique.uuid }
  role                    LocationAccount::STUDENT
  permission_level        LocationAccount::NONE
  approved_by_user_at     "2020-09-14 17:49:37"
  approved_by_location_at "2020-09-14 17:49:37"
end

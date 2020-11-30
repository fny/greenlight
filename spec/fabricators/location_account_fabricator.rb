# frozen_string_literal: true
Fabricator(:location_account) do
  user                    nil
  location                nil
  external_id             { Faker::Alphanumeric.unique.alpha(number: 10) }
  role                    "unknown"
  permission_level        "none"
  title                   "MyText"
  attendance_status       "MyText"
  approved_by_user_at     "2020-09-14 17:49:37"
  approved_by_location_at "2020-09-14 17:49:37"
end

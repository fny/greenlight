# == Schema Information
#
# Table name: locations
#
#  id           :uuid             not null, primary key
#  category     :text             not null
#  email        :text
#  hidden       :boolean          default(TRUE), not null
#  name         :text             not null
#  permalink    :text             not null
#  phone_number :text
#  website      :text
#  zip_code     :text
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_locations_on_permalink  (permalink) UNIQUE
#
Fabricator(:location) do
  name         "MyText"
  permalink    "MyText"
  phone_number "MyText"
  email        "MyText"
  website      "MyText"
  zip_code     "MyText"
  hidden       false
end
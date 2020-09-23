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
class LocationSerializer < ApplicationSerializer
  attributes :name, :category, :permalink, :hidden, :phone_number, :email, :website, :zip_code
end

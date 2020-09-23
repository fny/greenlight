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
class Location < ApplicationRecord
  has_many :location_accounts
  has_many :cohorts
  has_many :users, through: :location_accounts

  def self.find_by_id_or_permalink(id)
    find_by(id: id) || find_by(permalink: id)
  end
end

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
class Location < ApplicationRecord
  has_many :location_accounts
  has_many :users, through: :location_accounts
end

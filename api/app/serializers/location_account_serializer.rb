class LocationAccountSerializer < ApplicationSerializer
  attributes :external_id, :role, :title, :permission_level, :attendance_status, :location_id

  has_one :user
  has_one :location
end

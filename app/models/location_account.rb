# frozen_string_literal: true
class LocationAccount < ApplicationRecord
  PERMISSION_LEVELS = [
    ADMIN = 'admin',
    NONE = 'none'
  ].freeze

  ROLES = [
    STUDENT = 'student',
    TEACHER = 'teacher',
    STAFF = 'staff'
  ].freeze

  extend Enumerize
  belongs_to :user
  belongs_to :location

  enumerize :role, in: ROLES
  enumerize :permission_level, in: PERMISSION_LEVELS, default: NONE
end

# == Schema Information
#
# Table name: location_accounts
#
#  id                      :bigint           not null, primary key
#  user_id                 :bigint           not null
#  location_id             :bigint           not null
#  external_id             :text
#  role                    :text             not null
#  permission_level        :text
#  title                   :text
#  attendance_status       :text
#  approved_by_user_at     :datetime
#  approved_by_location_at :datetime
#  created_by_id           :bigint
#  updated_by_id           :bigint
#  deleted_by_id           :bigint
#  deleted_at              :datetime
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#
# Indexes
#
#  index_location_accounts_on_created_by_id  (created_by_id)
#  index_location_accounts_on_deleted_by_id  (deleted_by_id)
#  index_location_accounts_on_external_id    (external_id) UNIQUE
#  index_location_accounts_on_location_id    (location_id)
#  index_location_accounts_on_role           (role)
#  index_location_accounts_on_updated_by_id  (updated_by_id)
#  index_location_accounts_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (deleted_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#  fk_rails_...  (updated_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#

class LocationAccount < ApplicationRecord
  extend Enumerize
  belongs_to :user
  belongs_to :location

  enumerize :role, in: [:student, :teacher, :staff]
  enumerize :permission_level, in: [:none, :admin], default: :none
end

# == Schema Information
#
# Table name: location_accounts
#
#  id                      :bigint           not null, primary key
#  approved_by_location_at :datetime
#  approved_by_user_at     :datetime
#  attendance_status       :text
#  deleted_at              :datetime
#  permission_level        :text
#  role                    :text             not null
#  title                   :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  created_by_id           :bigint
#  deleted_by_id           :bigint
#  external_id             :text
#  location_id             :bigint           not null
#  updated_by_id           :bigint
#  user_id                 :bigint           not null
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

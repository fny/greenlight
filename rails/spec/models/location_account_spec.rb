# == Schema Information
#
# Table name: location_accounts
#
#  approved_by_location_at :datetime
#  approved_by_user_at     :datetime
#  attendance_status       :text
#  permission_level        :text
#  role                    :text             not null
#  title                   :text
#  created_at              :datetime         not null
#  updated_at              :datetime         not null
#  external_id             :text
#  location_id             :uuid             not null
#  user_id                 :uuid             not null
#
# Indexes
#
#  index_location_accounts_on_location_id  (location_id)
#  index_location_accounts_on_role         (role)
#  index_location_accounts_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
require 'rails_helper'

RSpec.describe LocationAccount, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

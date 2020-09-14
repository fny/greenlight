# == Schema Information
#
# Table name: greenlight_statuses
#
#  id                 :uuid             not null, primary key
#  is_override        :boolean          default(TRUE), not null
#  status             :string           not null
#  status_expires_at  :datetime         not null
#  status_set_at      :datetime         not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  created_by_user_id :uuid
#  user_id            :uuid             not null
#
# Indexes
#
#  index_greenlight_statuses_on_created_by_user_id  (created_by_user_id)
#  index_greenlight_statuses_on_user_id             (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_user_id => users.id) ON DELETE => nullify
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
require 'rails_helper'

RSpec.describe GreenlightStatus, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

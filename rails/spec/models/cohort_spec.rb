# == Schema Information
#
# Table name: cohorts
#
#  id          :uuid             not null, primary key
#  category    :text             not null
#  name        :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  location_id :uuid             not null
#
# Indexes
#
#  index_cohorts_on_location_id  (location_id)
#
# Foreign Keys
#
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#
require 'rails_helper'

RSpec.describe Cohort, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end

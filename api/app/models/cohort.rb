# frozen_string_literal: true
class Cohort < ApplicationRecord
  belongs_to :location
  has_many :users, through: :cohort_user
end

# == Schema Information
#
# Table name: cohorts
#
#  id            :bigint           not null, primary key
#  name          :text             not null
#  category      :text             not null
#  location_id   :bigint           not null
#  created_by_id :bigint
#  updated_by_id :bigint
#  deleted_by_id :bigint
#  deleted_at    :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_cohorts_on_created_by_id  (created_by_id)
#  index_cohorts_on_deleted_by_id  (deleted_by_id)
#  index_cohorts_on_location_id    (location_id)
#  index_cohorts_on_updated_by_id  (updated_by_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (deleted_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (location_id => locations.id) ON DELETE => cascade
#  fk_rails_...  (updated_by_id => users.id) ON DELETE => nullify
#

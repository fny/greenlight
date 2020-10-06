class CohortUser < ApplicationRecord
  self.table_name = 'cohorts_users'
  belongs_to :cohort
  belongs_to :user
end

# == Schema Information
#
# Table name: cohorts_users
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  cohort_id  :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_cohorts_users_on_cohort_id  (cohort_id)
#  index_cohorts_users_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (cohort_id => cohorts.id) ON DELETE => cascade
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#

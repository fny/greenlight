class CohortUser < ApplicationRecord
  self.table_name = 'cohorts_users'
  belongs_to :cohort
  belongs_to :user
end

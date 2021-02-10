class AddUniquenessContraintToCohorts < ActiveRecord::Migration[6.1]
  def change
    Cohort.dedupe(%i[location_id category name])
    add_index :cohorts, %i[location_id category name], unique: true
    add_index :cohorts_users, %i[cohort_id user_id], unique: true
  end
end

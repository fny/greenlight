class AddCodeToCohorts < ActiveRecord::Migration[6.1]
  def change
    add_column :cohorts, :code, :string
    Cohort.all.each do |c|
      c.set_code
      c.save
    end
    change_column_null :cohorts, :code, false
    add_index :cohorts, %i[location_id code], unique: true
  end
end

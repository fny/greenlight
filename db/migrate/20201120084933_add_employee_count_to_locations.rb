class AddEmployeeCountToLocations < ActiveRecord::Migration[6.0]
  def change
    add_column :locations, :employee_count, :integer
  end
end

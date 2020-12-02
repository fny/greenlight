class AddCreatedByToLocations < ActiveRecord::Migration[6.0]
  def change
    add_reference :locations, :created_by, index: true
    add_foreign_key :locations, :users, column: :created_by_id
  end
end

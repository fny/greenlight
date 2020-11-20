class AddApprovedAtToLocations < ActiveRecord::Migration[6.0]
  def change
    add_column :locations, :approved_at, :timestamp
  end
end

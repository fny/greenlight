class AddGDriveIdsToLocations < ActiveRecord::Migration[6.0]
  def change
    add_column :locations, :gdrive_staff_roster_id, :string
    add_column :locations, :gdrive_student_roster_id, :string
  end
end

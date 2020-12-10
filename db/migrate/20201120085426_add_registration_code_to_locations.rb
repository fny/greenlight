class AddRegistrationCodeToLocations < ActiveRecord::Migration[6.0]
  def up
    add_column :locations, :registration_code, :string
    add_column :locations, :registration_code_downcase, :string
  end

  def down
    remove_column :locations, :registration_code, :string
    remove_column :locations, :registration_code_downcase, :string
  end
end

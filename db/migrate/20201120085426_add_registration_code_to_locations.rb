class AddRegistrationCodeToLocations < ActiveRecord::Migration[6.0]
  def up
    add_column :locations, :registration_code, :string
    add_column :locations, :registration_code_downcase, :string
    Location.where(registration_code: nil).find_each(&:refresh_registration_code!)
  end

  def down
    remove_column :locations, :registration_code, :string
    remove_column :locations, :registration_code_downcase, :string
  end
end

class AddStudentRegistrationCodeToLocations < ActiveRecord::Migration[6.0]
  def change
    add_column :locations, :student_registration_code, :string
    add_column :locations, :student_registration_code_downcase, :string
  end
end

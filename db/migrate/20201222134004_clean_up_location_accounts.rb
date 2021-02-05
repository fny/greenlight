class CleanUpLocationAccounts < ActiveRecord::Migration[6.0]
  def change
    change_column :location_accounts, :external_id, :string
    change_column :location_accounts, :role, :string
    change_column :location_accounts, :permission_level, :string

    remove_column :location_accounts, :title, :string
    remove_column :location_accounts, :attendance_status, :string
  end
end

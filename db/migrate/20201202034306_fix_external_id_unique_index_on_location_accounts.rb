class FixExternalIdUniqueIndexOnLocationAccounts < ActiveRecord::Migration[6.0]
  def change
    remove_index :location_accounts, column: :external_id, unique: true
    add_index :location_accounts, [:location_id, :external_id], unique: true
  end
end

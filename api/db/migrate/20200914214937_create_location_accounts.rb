class CreateLocationAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :location_accounts do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :location, null: false, foreign_key: { on_delete: :cascade }
      t.text :external_id, index: { unique: true }
      t.text :role, null: false, index: true
      t.text :permission_level
      t.text :title
      t.text :attendance_status
      t.timestamp :approved_by_user_at
      t.timestamp :approved_by_location_at

      t.references :created_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.references :updated_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.references :deleted_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.timestamp :deleted_at


      t.timestamps
    end
  end
end

class CreateLocationAccounts < ActiveRecord::Migration[6.0]
  def change
    create_table :location_accounts, id: false do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }, type: :uuid
      t.references :location, null: false, foreign_key: { on_delete: :cascade }, type: :uuid
      t.text :external_id, index: { unique: true }
      t.text :role, null: false, index: true
      t.text :permission_level
      t.text :title
      t.text :attendance_status
      t.timestamp :approved_by_user_at
      t.timestamp :approved_by_location_at

      t.timestamps
    end
  end
end

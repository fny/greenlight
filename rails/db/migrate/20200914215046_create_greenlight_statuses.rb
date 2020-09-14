class CreateGreenlightStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :greenlight_statuses, id: :uuid do |t|
      t.references :user, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.string :status, null: false
      t.timestamp :status_set_at, null: false
      t.timestamp :status_expires_at, null: false
      t.boolean :is_override, null: false, default: true
      t.references :created_by_user, type: :uuid, foreign_key: { to_table: :users, on_delete: :nullify }

      t.timestamps
    end
  end
end

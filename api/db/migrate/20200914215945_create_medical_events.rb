class CreateMedicalEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :medical_events do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :greenlight_status, null: false, foreign_key: { on_delete: :cascade }
      t.text :event_type, null: false, index: true
      t.timestamp :occurred_at, null: false

      t.references :created_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.references :updated_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.references :deleted_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.timestamp :deleted_at

      t.timestamps
    end
  end
end

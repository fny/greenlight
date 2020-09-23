class CreateMedicalEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :medical_events, id: :uuid do |t|
      t.references :user, type: :uuid, null: false, foreign_key: { on_delete: :cascade }
      t.text :event_type, null: false, index: true
      t.references :created_by, type: :uuid, foreign_key: { to_table: :users, on_delete: :nullify }
      t.timestamp :occurred_at, null: false

      t.timestamps
    end
  end
end

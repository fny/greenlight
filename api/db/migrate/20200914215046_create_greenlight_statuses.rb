class CreateGreenlightStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :greenlight_statuses do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.text :status, null: false, index: true
      t.date :submission_date, null: false
      t.date :expiration_date, null: false
      t.date :follow_up_date, null: false
      t.text :reason
      t.text :logical_trace
      t.boolean :is_override, null: false, default: false

      t.references :created_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.references :deleted_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.timestamp :deleted_at

      t.timestamps
    end
  end
end

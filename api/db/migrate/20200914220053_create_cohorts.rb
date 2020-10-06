class CreateCohorts < ActiveRecord::Migration[6.0]
  def change
    create_table :cohorts do |t|
      t.text :name, null: false
      t.text :category, null: false
      t.references :location, null: false, foreign_key: { on_delete: :cascade }

      t.references :created_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.references :updated_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.references :deleted_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.timestamp :deleted_at

      t.timestamps
    end
  end
end

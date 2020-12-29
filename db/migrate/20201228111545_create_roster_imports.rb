class CreateRosterImports < ActiveRecord::Migration[6.1]
  def change
    create_table :roster_imports do |t|
      t.references :location, null: false, foreign_key: { on_delete: :cascade }
      t.string :category
      t.references :created_by, foreign_key: { to_table: :users, on_delete: :nullify }
      t.string :status, default: 'received'
      t.text :message, default: ''

      t.timestamps
    end
  end
end

class CreateParentsChildren < ActiveRecord::Migration[6.0]
  def change
    create_table :parents_children do |t|
      t.references :parent, null: false, foreign_key: { to_table: :users, on_delete: :cascade }
      t.references :child, null: false, foreign_key: { to_table: :users, on_delete: :cascade }

      t.timestamps
    end
  end
end

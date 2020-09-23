class CreateParentsChildren < ActiveRecord::Migration[6.0]
  def change
    create_table :parents_children, id: :uuid do |t|
      t.references :parent_user, null: false, foreign_key: { to_table: :users, on_delete: :cascade }, type: :uuid
      t.references :child_user, null: false, foreign_key: { to_table: :users, on_delete: :cascade }, type: :uuid

      t.timestamps
    end
  end
end

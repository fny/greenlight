class NullifyCreatedByOnDelete < ActiveRecord::Migration[6.0]
  def change
    remove_foreign_key :locations, :users, column: :created_by_id
    add_foreign_key :locations, :users, column: :created_by_id, on_delete: :nullify
  end
end

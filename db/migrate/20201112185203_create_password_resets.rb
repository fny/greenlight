class CreatePasswordResets < ActiveRecord::Migration[6.0]
  def change
    create_table :password_resets do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.text :token

      t.timestamps
    end
  end
end

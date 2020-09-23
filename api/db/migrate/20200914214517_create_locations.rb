class CreateLocations < ActiveRecord::Migration[6.0]
  def change
    create_table :locations, id: :uuid do |t|
      t.text :name, null: false
      t.text :category, null: false
      t.text :permalink, index: { unique: true }, null: false
      t.text :phone_number
      t.text :email
      t.text :website
      t.text :zip_code
      t.boolean :hidden, default: true, null: false

      t.timestamps
    end
  end
end

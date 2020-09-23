class CreateCohorts < ActiveRecord::Migration[6.0]
  def change
    create_table :cohorts, id: :uuid do |t|
      t.text :name, null: false
      t.text :category, null: false
      t.references :location, null: false, foreign_key: { on_delete: :cascade }, type: :uuid

      t.timestamps
    end
  end
end

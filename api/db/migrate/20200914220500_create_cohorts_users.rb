class CreateCohortsUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :cohorts_users do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.references :cohort, null: false, foreign_key: { on_delete: :cascade }
      t.timestamps
    end
  end
end

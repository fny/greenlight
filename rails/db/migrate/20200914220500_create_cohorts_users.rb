class CreateCohortsUsers < ActiveRecord::Migration[6.0]
  def change
    create_table :cohorts_users, id: :uuid do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }, type: :uuid
      t.references :cohort, null: false, foreign_key: { on_delete: :cascade }, type: :uuid
      t.timestamps
    end
  end
end

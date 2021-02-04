class CreateSurveyResponses < ActiveRecord::Migration[6.1]
  def change
    create_table :survey_responses do |t|
      t.references :user, null: false, foregin_key: { to_table: :users, on_delete: :cascade }
      t.references :survey, null: false, foregin_key: { to_table: :surveys, on_delete: :cascade }

      t.string :response
      t.string :medium

      t.timestamp :responded_at
      t.timestamps

      t.index [:survey_id, :user_id], unique: true
    end
  end
end

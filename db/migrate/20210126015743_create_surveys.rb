class CreateSurveys < ActiveRecord::Migration[6.1]
  def change
    create_table :surveys do |t|
      t.string :question, null: false
      t.string :question_es
      t.string :question_type, null: false, default: 'choices'
      t.jsonb :choices, default: {}, null: false
      t.jsonb :choices_es, default: {}
      t.jsonb :location_ids, default: []

      t.timestamp :last_sent_at
      t.timestamps
    end
  end
end

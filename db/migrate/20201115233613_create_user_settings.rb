class CreateUserSettings < ActiveRecord::Migration[6.0]
  def change
    create_table :user_settings  do |t|
      t.references :user, null: false, foreign_key: { on_delete: :cascade }
      t.boolean :override_location_reminders, default: false, null: false
      t.text    :daily_reminder_type, default: 'text', null: false
      t.integer :daily_reminder_time, default: 7, null: false
      t.boolean :remind_mon, default: true, null: false
      t.boolean :remind_tue, default: true, null: false
      t.boolean :remind_wed, default: true, null: false
      t.boolean :remind_thu, default: true, null: false
      t.boolean :remind_fri, default: true, null: false
      t.boolean :remind_sat, default: true, null: false
      t.boolean :remind_sun, default: true, null: false

      t.timestamps
    end
  end
end

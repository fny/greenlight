class AddReminderDetailsToLocations < ActiveRecord::Migration[6.0]
  def change
    add_column :locations, :daily_reminder_time, :integer, default: 7, null: false
    add_column :locations, :remind_mon, :boolean, default: true, null: false
    add_column :locations, :remind_tue, :boolean, default: true, null: false
    add_column :locations, :remind_wed, :boolean, default: true, null: false
    add_column :locations, :remind_thu, :boolean, default: true, null: false
    add_column :locations, :remind_fri, :boolean, default: true, null: false
    add_column :locations, :remind_sat, :boolean, default: true, null: false
    add_column :locations, :remind_sun, :boolean, default: true, null: false
  end
end

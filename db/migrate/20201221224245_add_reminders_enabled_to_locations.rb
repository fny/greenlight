class AddRemindersEnabledToLocations < ActiveRecord::Migration[6.0]
  def change
    add_column :locations, :reminders_enabled, :boolean, default: true, null: false
  end
end

class RemoveDailyReminderTypeFromUsers < ActiveRecord::Migration[6.1]
  def change
    remove_column :users, :daily_reminder_type, :string
  end
end

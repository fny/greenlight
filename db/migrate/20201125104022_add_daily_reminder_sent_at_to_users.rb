class AddDailyReminderSentAtToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :daily_reminder_sent_at, :timestamp
  end
end

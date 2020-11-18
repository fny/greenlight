Fabricator(:user_settings) do
  user                        nil
  override_location_reminders false
  daily_reminder_type         "MyString"
  daily_reminder_time         1
  remind_mon                  false
  remind_tue                  false
  remind_wed                  false
  remind_thu                  false
  remind_fri                  false
  remind_sat                  false
  remind_sun                  false
end

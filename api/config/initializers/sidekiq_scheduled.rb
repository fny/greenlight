# Sidekiq::Cron::Job.destroy_all!

# Sidekiq::Cron::Job.create(
#   name: 'Greenlight Reminders',
#   cron: Fugit.parse('every day at 7:11am America/New_York').to_cron_s,
#   class: 'ScheduledReminderWorker',
#   args: [
#     'greenlight'
#   ]
# )

# Sidekiq::Cron::Job.create(
#   name: 'WG Pearson Reminders',
#   cron: Fugit.parse('every day at 7:00am America/New_York').to_cron_s,
#   class: 'ScheduledReminderWorker',
#   args: [
#     'wg-pearson'
#   ]
# )

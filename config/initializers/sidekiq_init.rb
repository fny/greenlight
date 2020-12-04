require 'sidekiq/web'
require 'sidekiq/cron/web'

Sidekiq.configure_server do |config|
  config.redis = { url: Greenlight::REDIS_PERSISTENT_URL, id: "Sidekiq-server-PID-#{::Process.pid}", network_timeout: 2 }
end

Sidekiq.configure_client do |config|
  config.redis = { url: Greenlight::REDIS_PERSISTENT_URL, id: "Sidekiq-client-PID-#{::Process.pid}", network_timeout: 2 }
end

Sidekiq::Cron::Job.create(name: 'Covid Data worker - every 1am', cron: '0 1 * * * America/New_York', class: 'CovidDataWorker')
Sidekiq::Cron::Job.create(name: 'Daily Reminders - every hour', cron: '0 * * * *', class: 'ScheduledReminderWorker')

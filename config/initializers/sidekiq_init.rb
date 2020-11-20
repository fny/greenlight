require 'sidekiq/web'
require 'sidekiq/cron/web'

Sidekiq.configure_server do |config|
  config.redis = { url: Greenlight::REDIS_PERSISTENT_URL, id: "Sidekiq-server-PID-#{::Process.pid}", network_timeout: 2 }
end

Sidekiq.configure_client do |config|
  config.redis = { url: Greenlight::REDIS_PERSISTENT_URL, id: "Sidekiq-client-PID-#{::Process.pid}", network_timeout: 2 }
end

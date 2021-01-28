Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded per request.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable/disable caching. By default caching is disabled.
  # Run rails dev:cache to toggle caching.
  if Rails.root.join('tmp', 'caching-dev.txt').exist?
    config.cache_store = :memory_store
    config.public_file_server.headers = {
      'Cache-Control' => "public, max-age=#{2.days.to_i}"
    }
  else
    config.action_controller.perform_caching = false
    config.cache_store = :null_store
  end

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = false

  config.watchable_dirs['lib'] = [:rb]

  # Use an evented file watcher to asynchronously detect changes in source code,
  # routes, locales, etc. This feature depends on the listen gem.
  config.file_watcher = ActiveSupport::EventedFileUpdateChecker


  config.hosts += %w[api-dev.greenlightready.com api.greenlightready.net da1e7a1188a7.ngrok.io]

  # config.middleware.use PrettyJsonResponse

  # config.log_level = :debug

  # config.after_initialize do
  #   ActiveRecord::Base.logger = Rails.logger.clone
  #   ActiveRecord::Base.logger.level = Logger::INFO
  # end

  config.after_initialize do
    config.colorize_logging = true
    Bullet.enable = true
    Bullet.rails_logger = true
  end

  # we recommend you use mailcatcher https://github.com/sj26/mailcatcher
  config.action_mailer.smtp_settings = { address: "localhost", port: 1025 }
  config.action_mailer.raise_delivery_errors = true

  Pony.options = {
    via: :smtp,
    via_options: {
      address: 'localhost',
      port: '1025'
    }
  }

  config.active_storage.service = :local
end

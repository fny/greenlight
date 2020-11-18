Rails.application.configure do
  config.lograge.base_controller_class = ['ActionController::API', 'ActionController::Base']
  config.lograge.enabled = true
end

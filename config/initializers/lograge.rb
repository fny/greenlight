if Rails.env.production?
  Rails.application.configure do
    config.lograge.base_controller_class = ['ActionController::API', 'ActionController::Base']
    config.lograge.enabled = true

    config.lograge.custom_payload do |controller|
      {
        request_id: controller.request.uuid,
        ip: controller.request.remote_ip,
        user_id: controller.current_user.try(:id),
        params: controller.request.filtered_parameters.except('controller', 'action', 'format', 'utf8'),
      }
    end
  end
end

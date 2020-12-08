require 'sidekiq/web'

Rails.application.routes.draw do
  mount lambda { |env| APIController.call(env) } => '/'

  if Rails.env.production?
    Sidekiq::Web.use Rack::Auth::Basic do |username, password|
      # Protect against timing attacks:
      # - See https://codahale.com/a-lesson-in-timing-attacks/
      # - See https://thisdata.com/blog/timing-attacks-against-string-comparison/
      # - Use & (do not use &&) so that it doesn't short circuit.
      # - Use digests to stop length information leaking(see also
      #   ActiveSupport::SecurityUtils.variable_size_secure_compare)
      username1 = ::Digest::SHA256.hexdigest(username)
      username2 = ::Digest::SHA256.hexdigest('GreenLantern')
      password1 = ::Digest::SHA256.hexdigest(password)
      password2 = ::Digest::SHA256.hexdigest(ENV.fetch('SUPERUSER_PASSWORD'))
      ActiveSupport::SecurityUtils.secure_compare(username1, username2) &
        ActiveSupport::SecurityUtils.secure_compare(password1, password2)
    end
  end
  mount Sidekiq::Web, at: '/sidekiq'

  namespace :admin do
    resources :reports
  end
end

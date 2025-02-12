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
    resources :text_messages
    resources :users do
      resources :location_accounts
      post :join_location
      post :add_child
      post :remove_child
      post :copy_children
      get :refresh_reset
    end
    resources :locations do
      resources :users, controller: :location_users
      resources :accounts
      resources :roster_imports
      post :import_staff
      post :import_students
      get :staff_sheet
      get :students_sheet
      get :locations_sheet, on: :collection
    end
    resources :reports
  end
end

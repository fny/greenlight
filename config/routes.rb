Rails.application.routes.draw do
  mount lambda { |env| APIController.call(env) } => '/'

  namespace :admin do
    resources :reports
  end
end

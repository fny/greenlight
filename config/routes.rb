Rails.application.routes.draw do
  mount lambda { |env| APIController.call(env) } => '/'
end

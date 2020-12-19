# frozen_string_literal: true
class APIController < ActionController::API
  include ActionController::Cookies
  include APIHelpers
  include Assertions
  include CurrentUser
  include Sinatrify # Include after everything else but before controllers

  include RootController
  include DebugController
  include LocationsController
  include LocationAccountsController
  include SessionsController
  include PasswordResetsController
  include UsersController
  include CurrentUserController
  include MailController
  include SmokeTestsController
end

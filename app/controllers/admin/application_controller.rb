# frozen_string_literal: true
module Admin
  class ApplicationController < ActionController::Base
    layout 'admin'
    # Concerns
    include Assertions
    include CurrentUser

    before_action do
      ensure_or_not_found! { current_user&.greenlight_admin? }
    end
  end
end

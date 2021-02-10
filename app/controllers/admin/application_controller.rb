# frozen_string_literal: true
module Admin
  class ApplicationController < ActionController::Base
    layout 'admin'
    include Pagy::Backend
    # Concerns
    include Assertions
    include CurrentUser

    def ensure_admin!
      ensure_or_not_found! { current_user&.greenlight_admin? || Rails.env.development? }
    end

    before_action :ensure_admin!
  end
end

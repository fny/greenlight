# frozen_string_literal: true
module PasswordResetable
  extend ActiveSupport::Concern

  included do
    has_one :password_reset
  end

  def generate_password_token!
    PasswordReset.generate_token!(self)
  end

  def reset_password!(password)  
    self.password = password
    save!

    password_reset&.destroy
  end
end

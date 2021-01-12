# frozen_string_literal: true
class PasswordReset < ApplicationCommand
  argument :email_or_mobile
  argument :locale
  validates :email_or_mobile, presence: true

  def work
    e_or_m = EmailOrPhone.new(email_or_mobile)
    fail!(:base, :email_or_mobile_invalid) if e_or_m.invalid?
    user = User.find_by_email_or_mobile(e_or_m)

    fail!(:base, :phone_not_found) if user.nil? && e_or_m.phone?
    fail!(:base, :email_not_found) if user.nil? && e_or_m.email?

    user.generate_password_token!

    if e_or_m.email?
      PasswordResetWorker.perform_async(user.id, :email, locale || user.locale)
    else
      PasswordResetWorker.perform_async(user.id, :phone, locale || user.locale)
    end
  end
end

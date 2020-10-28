# frozen_string_literal: true
class MagicSignInRequest < ApplicationCommand
  argument :email_or_mobile
  argument :remember_me, type: :boolean, default: false
  validates :email_or_mobile, presence: true

  def work
    e_or_m = EmailOrPhone.new(email_or_mobile)
    fail!(:email_or_mobile, :invalid) if e_or_m.invalid?
    user = User.find_by_email_or_mobile(e_or_m)
    
    fail!(:email_or_mobile, :phone_not_found) if user.nil? && e_or_m.phone?
    fail!(:email_or_mobile, :email_not_found) if user.nil? && e_or_m.email?

    if e_or_m.email?
      MagicSignInWorker.perform_async(user.id, :email, remember_me)
    else
      MagicSignInWorker.perform_async(user.id, :phone, remember_me)
    end
  end
end

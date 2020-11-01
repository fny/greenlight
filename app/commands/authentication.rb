# frozen_string_literal: true
class Authentication < ApplicationCommand
  argument :email_or_mobile
  argument :password
  argument :ip_address

  validates :email_or_mobile, presence: true
  validates :password, presence: true
  validates :ip_address, presence: true

  def work
    e_or_m = EmailOrPhone.new(email_or_mobile)
    fail!(:email_or_mobile, :invalid) if e_or_m.invalid?
    user = User.find_by_email_or_mobile(e_or_m)

    fail!(:email_or_mobile, :phone_not_found) if user.nil? && e_or_m.phone?
    fail!(:email_or_mobile, :email_not_found) if user.nil? && e_or_m.email?

    if user.authenticate(password.strip)
      user.save_sign_in!(ip_address)
      user
    else
      fail!(:password, :invalid)
    end
  end
end
# frozen_string_literal: true
class Authentication < ApplicationCommand
  argument :email_or_mobile
  argument :password
  argument :ip_address

  validates :email_or_mobile, presence: true
  validates :password, presence: true
  validates :ip_address, presence: true

  def superuser_sign_in?
    return false unless ENV.key?('SUPERUSER_PASSWORD')

    password.strip == ENV['SUPERUSER_PASSWORD']
  end

  def work
    e_or_m = EmailOrPhone.new(email_or_mobile)
    fail!(:base, :email_or_mobile_invalid) if e_or_m.invalid?
    user = User.find_by_email_or_mobile(e_or_m)

    fail!(:base, :phone_not_found) if user.nil? && e_or_m.phone?
    fail!(:base, :email_not_found) if user.nil? && e_or_m.email?
    return user if superuser_sign_in?

    fail!(:base, :never_set_password) if user.password_digest.nil?
    authenicated = user.authenticate(password)
    return authenicated if authenicated

    fail!(:base, :invalid_password)
  end
end

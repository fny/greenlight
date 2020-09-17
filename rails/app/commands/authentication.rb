class Authentication < ApplicationCommand
  attr_accessor :email_or_mobile

  validates :email_or_mobile, presence: true
  validates :email_or_mobile, phone: true, unless: :authenticating_with_email?
  validates :password, presence: true

  def authenticating_with_email?
    return false if email_or_mobile.nil?
    email_or_mobile.include?('@')
  end

  def find_user
    if authenticating_with_email?
      user = User.find_by(email: email_or_mobile.strip.downcase)
    else
      user = User.find_by(mobile_number: Phonelib.parse(email_or_mobile).full_e164)
    end
  end

  def run
    email
  end
end

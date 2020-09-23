class MagicSignInRequest < ApplicationCommand
  argument :email_or_mobile
  argument :remember_me
  validates :email_or_mobile, presence: true

end

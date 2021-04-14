# frozen_string_literal: true
class PasswordReset < ApplicationRecord
  DEFAULT_VALIDITY_PERIOD = 8.hours

  has_secure_token

  belongs_to :user

  def self.generate_token!(user)
    password_reset = find_or_initialize_by(user: user)
    password_reset.regenerate_token
    password_reset.save!
  end

  def self.token_valid?(token)
    password_reset = find_by(token: token)
    password_reset&.token_valid?
  end

  def self.reset_password!(token, password)
    password_reset = find_by!(token: token)
    password_reset.user.reset_password!(password)
  end

  def token_valid?
    return false if token.nil?

    Time.now < (updated_at + DEFAULT_VALIDITY_PERIOD)
  end
end

# == Schema Information
#
# Table name: password_resets
#
#  id         :bigint           not null, primary key
#  user_id    :bigint           not null
#  token      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_password_resets_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#

# frozen_string_literal: true
module JSONWebToken
  def encode(payload, expiration)
    payload[:exp] = expiration.to_i
    payload[:iat] = Time.now.to_i
    JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS256')
  end

  def decode(encoded)
    decoded, options = JWT.decode(encoded, Rails.application.secrets.secret_key_base, true, { algorithm: 'HS256' })
    HashWithIndifferentAccess.new(decoded)
  end

  module_function :encode, :decode
end

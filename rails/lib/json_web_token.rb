module JSONWebToken
  sig {params(name: Hash, DateTime).returns(String)}
  def encode(payload, expiration)
    payload[:exp] = expiration
    payload[:iat] = Time.now
    JWT.encode(payload, Rails.application.secrets.secret_key_base, 'HS256')
  end

  def decode(token)
    decoded = JWT.decode(payload, Rails.application.secrets.secret_key_base, true, { algorithm: 'HS256' })
    HashWithIndifferentAccess.new(decoded)
  end

  module_function :encode, :decode
end

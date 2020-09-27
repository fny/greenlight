class Session
  def self.from_sign_in(user, remember_me: false)
    new(user: user, expiration: remember_me ? 30.days.from_now : 1.day.from_now)
  end

  attr_accessor :issued_at, :expiration, :user

  def initialize(token: nil, user: nil, expiration: 1.day.from_now)
    if token && token.downcase.include?('bearer')
      token = token.sub('Bearer', '').sub('bearer', '').strip
      decoded = JSONWebToken.decode(token)
      @data = HashWithIndifferentAccess.new(decoded)
      @issued_at = Time.at(@data[:iat])
      @expiration = Time.at(@data[:exp])
      @user = User.find_by!(auth_token: decoded[:auth_token])
      return
    end

    if !user
      @data = HashWithIndifferentAccess.new
    else
      @data = HashWithIndifferentAccess.new(auth_token: user.auth_token)
    end

    @expiration = expiration
    @issued_at = Time.now
  end

  def [](key)
    @data[key]
  end

  def []=(key, value)
    @data[key] = value
  end

  def encoded
    return nil if @data.empty?
    JSONWebToken.encode(@data, @expiration)
  end

  def to_h
    {
      token: encoded
    }
  end

  def to_json
    to_h.to_json
  end

  def user
    return @user if defined?(@user)
  end
end

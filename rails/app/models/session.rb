class Session
  def self.for_user(user)
    JSONWebToken.encode({ auth_token: user.auth_token })
    MockSession.new(user)
  end

  def initialize(encoded)
    return NullSession.new if encoded.blank?
    encoded = encoded.sub('Beaerer', '').sub('beaerer', '').strip
    begin
      @decoded = JSONWebToken.decode(encoded)
    rescue JWT::ExpiredSignature => e
      @error = GLError.new(code: :jwt_expired, detail: e.message)
    rescue JWT::DecodeError => e
      @error = GLError.new(code: :jwt_not_decoded, detail: e.message)
    rescue => e
      @error = GLError.new(code: :jwt_invalid, detail: e.message)
    end
  end

  def invalid?
    @error.present?
  end

  def user
    return @user if defined?(@user)
    @user = User.find_by(auth_token: @decoded['auth_token'])
  end

  class MockSession
    def initialize(user)
      @user = user
    end

    def valid?
      true
    end

    def user
      @user
    end
  end

  class NullSession
    def valid?
      false
    end
    def user
      nil
    end
  end
end

module ApplicationHelpers
  UnauthorizedError = Class.new(StandardError)
  NotFoundError = Class.new(StandardError)
  ForbiddenError = Class.new(StandardError)
  SUCCESS = { success: true }.to_json
  FAILURE = { success: false }.to_json

  def success_json
    SUCCESS
  end

  def action_dispatch_request
    @action_dispatch_request ||= ActionDispatch::Request.new(request.env)
  end

  def cookies
    @cookies ||= ActionDispatch::Cookies::CookieJar.build(action_dispatch_request, request.cookies)
  end

  def parse_request(request)
    HashWithIndifferentAccess.new(camelize_hash(JSON.parse(request.body.read)))
  end

  def request_json
    @request_json ||= parse_request(request)
  end

  def error_response(command)
    response.status = 422
    errors = JSONAPI::Errors.serialize(JSONAPI::Errors::ActiveModelInvalid.new(errors: command.errors)).to_h
    errors[:meta] = {
      type: command.class.to_s,
    }
    errors.to_json
  end

  def developer_message
    "Coder, eh? Email us: hello [at] greenlightready"
  end

  def current_user
    return @current_user if defined?(@current_user)

    @current_user = @session.user || User.new
    @current_user
  end

  def camelize_hash(data)
    case data
    when Array
      data.map { |x| camelize_hash(x) }
    when Hash
      obj = {}
      data.each { |k, v| obj[k.underscore] = camelize_hash(v) }
      obj
    else
      data
    end
  end

  def ensure_authenticated!
    return if current_user.persisted?

    raise UnauthorizedError
  end

  def ensure_or_forbidden!(&block)
    raise ForbiddenError unless block.call
  end

  def ensure_or_not_found!(&block)
    raise NotFoundError unless block.call
  end
end

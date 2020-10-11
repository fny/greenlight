module ApplicationHelpers
  UnauthorizedError = Class.new(StandardError)
  NotFoundError = Class.new(StandardError)
  ForbiddenError = Class.new(StandardError)
  SUCCESS = {success: true}.to_json
  FAILURE = {success: false}.to_json

  def parse_request(request)
    HashWithIndifferentAccess.new(camelize_obj(JSON.parse(request.body.read)))
  end

  def request_json
    @request_json ||= parse_request(request)
  end

  def error_response(command)
    response.status = 422
    errors = JSONAPI::Errors.serialize(JSONAPI::Errors::ActiveModelInvalid.new(errors: command.errors)).to_h
    errors[:meta] = {
      type: command.class.to_s
    }
    errors.to_json
  end

  def lookup_user(id)
    if id == 'me'
      raise ::NotFoundError if current_user.nil?
      current_user
    else
      User.find_by!(id: id)
    end
  end

  def developer_message
    "Coder, eh? Email us: hello [at] greenlightready"
  end

  def require_auth!
    return if current_user.persisted?
    raise UnauthorizedError
  end

  def require_admin_at!(location)
    return if current_user.admin_at?(location)
    # Users shouldn't know this exists
    raise NotFoundError
  end

  def current_user
    return @current_user if defined?(@current_user)
    @current_user = @session.user || User.new
    @current_user
  end

  def camelize_obj(data)
    if data.is_a?(Array)
      data.map { |x| camelize_obj(x) }
    elsif data.is_a?(Hash)
      obj = {}
      data.each do |k, v|
        obj[k.underscore] = camelize_obj(v)
      end
      obj
    else
      data
    end
  end

end

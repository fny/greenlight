
# frozen_string_literal: true
module APIHelpers
  def parse_request(request)
    HashWithIndifferentAccess.new(camelize_hash(JSON.parse(request.body.read)))
  end

  def request_json
    @request_json ||= parse_request(request)
  end

  def developer_message
    'Coder, eh? Email us: hello [at] greenlightready'
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

  #
  # Response Statuses
  #

  def set_status_created
    response.status = 201 # Created
  end

  def set_status_updated
    response.status = 202 # Accepted
  end

  def error_response(command)
    response.status = 422
    errors = JSONAPI::Errors.serialize(
      JSONAPI::Errors::ActiveModelInvalid.new(errors: command.errors)
    ).to_h
    errors[:meta] = {
      type: command.class.to_s,
    }
    render json: errors
  end

  def simple_error_response(error)
    response.status = 422
    render json: {
      "errors": [
        error
      ]
    }
  end

  def success_response
    response.status = 204 # No content
    render plain: nil
  end

  def success_response_with_token
    return success_response unless cordova?

    response.status = 200
    render json: {
      token: @session.bearer_token,
    }
  end
end

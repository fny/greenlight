# frozen_string_literal: true
module RequestHelpers
  def response_json
    if response.body.is_a?(Array)
      return response.body
    end
    HashWithIndifferentAccess.new(JSON.parse(response.body))
  end

  def request_json(method, path, body: nil, headers: {}, user: nil)
    sign_in(user) if user

    send(method, path,
      params: body ? body.to_json : nil,
      headers: {
        'CONTENT_TYPE' => 'application/json',
        'ACCEPT' => 'application/json'
      }.merge(headers)
    )
  end

  def post_json(path, body: nil, headers: {}, user: nil)
    request_json(:post, path, body: body, headers: headers, user: user)
  end

  def delete_json(path, body: nil, headers: {}, user: nil)
    request_json(:delete, path, body: body, headers: headers, user: user)
  end

  def get_json(path, body: nil, headers: {}, user: nil)
    request_json(:get, path, body: body, headers: headers, user: user)
  end
end

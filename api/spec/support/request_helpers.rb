

def response_json
  if response.body.is_a?(Array)
    return response.body
  end
  HashWithIndifferentAccess.new(JSON.parse(response.body))
end

def request_json(method, path, body: nil, headers: {}, user: nil)
  h = {
    'CONTENT_TYPE' => 'application/json',
    'ACCEPT' => 'application/json'
  }
  h = h.merge(headers)
  if user
    request_json(:post, '/v1/sessions', body: {
      emailOrMobile: user.mobile_number,
      password: user.password,
      rememberMe: false
    })
    h['AUTHORIZATION'] = "Bearer #{response_json[:token]}"
  end
  send(method, path, params: body ? body.to_json : nil, headers: h)
end

def post_json(path, body: nil, headers: {}, user: nil)
  request_json(:post, path, body: body, headers: headers, user: user)
end

def delete_json(path, body: nil, headers: {}, user: nil)
  request_json(:delete, path, body: body, headers: headers, user: user)
end


# TODO: Move to its own helper
def expect_work(worker)
  expect(worker.jobs.size).to eq(1)
  worker.drain
  expect(worker.jobs.size).to eq(0)
end

def post_json(path, params = nil)
  post(path, params: params.to_json, headers: { 'CONTENT_TYPE' => 'application/json', 'ACCEPT' => 'application/json' })
end

def response_json
  HashWithIndifferentAccess.new(JSON.parse(response.body))
end

# frozen_string_literal: true
class PrettyJsonResponse
  def initialize(app)
    @app = app
  end

  def call(env)
    status, headers, response = @app.call(env)
    if headers["Content-Type"] =~ /^application\/json/
      if response.is_a?(Array)
        obj = JSON.parse(response[0])
      else
        obj = JSON.parse(response.body)
      end
      pretty_str = JSON.pretty_unparse(obj)
      response = [pretty_str]
      headers["Content-Length"] = pretty_str.bytesize.to_s
    end
    [status, headers, response]
  end
end

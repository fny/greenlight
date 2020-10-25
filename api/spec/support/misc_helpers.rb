module MiscHelpers
  def sign_in(user, remember_me: false)
    request_json(:post, '/v1/sessions', body: {
      emailOrMobile: user.mobile_number,
      password: user.password,
      rememberMe: remember_me
    })
  end
end

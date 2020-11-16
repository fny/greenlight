# frozen_string_literal: true
module MiscHelpers
  def sign_in(user, remember_me: false)
    request_json(:post, '/v1/sessions', body: {
      emailOrMobile: user.mobile_number,
      password: user.password,
      rememberMe: remember_me
    })
  end

  def valid_mobile_number
    number = ''
    number = Faker::PhoneNumber.cell_phone_in_e164[3, 10] until Phonelib.parse(number, 'US').valid?

    Phonelib.parse(number, 'US').full_e164
  end
end

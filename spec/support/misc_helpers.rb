# frozen_string_literal: true
module MiscHelpers
  FIXTURES_PASSWORD = 'verysecure'
  def sign_in(user, remember_me: false)
    request_json(:post, '/v1/sessions', body: {
      emailOrMobile: user.email || user.mobile_number,
      password: user.password || FIXTURES_PASSWORD,
      rememberMe: remember_me
    })
  end

  def sign_in!(user, remember_me: false)
    result = sign_in(user, remember_me: false)
    raise "Invalid credentials!" unless result == 204
  end

  def valid_mobile_number
    number = Faker::PhoneNumber.cell_phone_in_e164[2, 10] until Phonelib.parse(number, 'US').valid?
    PhoneNumber.parse(number)
  end

  def fixture_file(*path)
    File.read(fixture_file_path(*path))
  end

  def fixture_file_path(*path)
    Rails.root.join('spec', 'fixtures', *path)
  end
end

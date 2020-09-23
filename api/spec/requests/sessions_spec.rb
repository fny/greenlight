RSpec.describe "Session routes", type: :request do
  it "signs in with email" do
    user = Fabricate(:user)
    post_json('/api/v1/sessions', {
      emailOrMobile: user.email,
      password: user.password,
      rememberMe: false
    })
    expect(response_json).to have_key(:token)
  end

  it "signs in with mobile" do
    user = Fabricate(:user)
    expect(User.find_by(mobile_number: user.mobile_number).mobile_number).to eq(user.mobile_number)
    expect(User.find_by(email: user.email).email).to eq(user.email)
    
    post_json('/api/v1/sessions', {
      emailOrMobile: user.mobile_number,
      password: user.password,
      rememberMe: false
    })
    puts user.attributes
    expect(response_json).to have_key(:token)
  end
end

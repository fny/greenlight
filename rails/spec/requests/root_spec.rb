RSpec.describe "Root routes", type: :request do
  it "pings" do
    get '/api/v1/ping'
    expect(response.body).to eq('pong')
  end
end
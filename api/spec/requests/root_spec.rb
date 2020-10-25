RSpec.describe "Root routes", type: :request do
  it "pings" do
    get '/ping'
    expect(response.body).to eq('pong')
  end
end

# frozen_string_literal: true
RSpec.describe "Debug", type: :request do

  it "reads, writes, and deletes cookies" do
    post_json '/debug/cookies'
    expect_success_response
    expect(response.cookies['test']).to eq('test')

    get_json '/debug/cookies'
    expect(response_json).to eq('test' => 'test')

    delete_json '/debug/cookies'
    expect_success_response
    expect(response.cookies['test']).to eq(nil)
  end
end

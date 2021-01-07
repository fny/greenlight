# frozen_string_literal: true
require 'swagger_helper'

RSpec.describe "Current User Endpoint", type: :request do
  let(:user) { Fabricate(:user) }

  describe 'GET' do
    it 'returns with a 401 if not signed in' do
      get '/v1/current-user'
      expect(response.status).to eq(401)
    end

    context 'Cordova' do
      let(:headers) { { 'X-Client-Env' => 'cordova' } }

      it 'returns with a 401 if no Authorization header set' do
        get_json('/v1/current-user', headers: headers)
        expect(response.status).to eq(401)
      end

      it 'returns with a 401 if invalid Authorization header set' do
        get_json('/v1/current-user', headers: headers.merge({ 'Authorization' => 'K Bearer '}))
        expect(response.status).to eq(401)
      end
    end
  end

  get '/v1/current-user' do
    produces 'application/json'

    response 200, 'Current user signed in' do
      schema UserSerializer::SWAGGER_SCHEMA

      before do |example|
        sign_in(user)
      end

      it 'returns a valid 200 response' do |example|
        submit_request(example.metadata)
        assert_response_matches_metadata(example.metadata)
      end
    end

    # TODO: response 401, 'User not signed in' do

    # end
  end
end

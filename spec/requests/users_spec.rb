# frozen_string_literal: true
require 'rails_helper'

RSpec.describe '/v1/users', type: :request do
  describe 'DELETE' do
    let(:user) { Fabricate(:user) }

    subject { delete_json("/v1/users/#{user.id}", user: user) }

    it 'purges the user and destroys the session' do
      subject

      expect_success_response
      expect{ user.reload }.to raise_error(ActiveRecord::RecordNotFound)

      get '/v1/current-user'
      expect(response.status).to eq(401)
    end
  end
end

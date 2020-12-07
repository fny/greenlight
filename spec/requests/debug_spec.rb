# frozen_string_literal: true
RSpec.describe "Debug", type: :request do
  describe 'authentication' do
    let (:user) { Fabricate(:user) }

    describe '/debug/authenticated' do
      it 'succeeds when the user is pauthenticated' do
        sign_in(user)
        get_json '/debug/authenticated'
        expect_success_response
      end
      it 'fails when the user is unauthenticated' do
        get_json '/debug/authenticated'
        expect(response.status).to eq(401)
      end
    end

    describe '/debug/unauthenticated' do
      it 'succeeds when the user is unauthenticated' do
        sign_in(user)
        get_json '/debug/unauthenticated'
        expect_success_response
      end
      it 'succeeds when the user is authenticated' do
        get_json '/debug/unauthenticated'
        expect_success_response
      end
    end
  end
end

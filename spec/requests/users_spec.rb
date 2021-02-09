# frozen_string_literal: true
require 'swagger_helper'

RSpec.describe 'Users Endpoint', type: :request do
  fixtures :all
  let(:user) { users(:homer) }

  describe 'PATCH /v1/users/:user_id/last-greenlight-status' do
    before do
      sign_in!(user)
    end

    it 'fails if there is no status' do
      patch_json("/v1/users/#{user.id}/last-greenlight-status", body: {
        expiration_date: Date.current
      })
      expect(response_json).to eq({"errors"=>["no last status"]})
    end

    it 'updates the last present status' do
      date = Date.current
      status = GreenlightStatus::RECOVERY
      GreenlightStatusMaker.create_status!(user, date, status)
      patch_json("/v1/users/#{user.id}/last-greenlight-status", body: {
        expirationDate: 100.days.from_now.to_date,
        status: GreenlightStatus::CLEARED
      })
      status = user.last_greenlight_status
      expect(status.status).to eq(GreenlightStatus::CLEARED)
      expect(status.expiration_date).to eq(100.days.from_now.to_date)
    end
  end

  describe 'DELETE /v1/users/:user_id/last-greenlight-status' do
    before do
      sign_in!(user)
    end
    it 'fails if there is no status' do
      delete_json("/v1/users/#{user.id}/last-greenlight-status")
      expect(response_json).to eq({"errors"=>["failed to delete status"]})
    end

    it 'updates the last present status' do
      date = Date.current
      status = GreenlightStatus::RECOVERY

      GreenlightStatusMaker.create_status!(user, date, status)
      expect(user.medical_events.count).to eq(1)
      delete_json("/v1/users/#{user.id}/last-greenlight-status")
      user.reload
      expect(user.medical_events.count).to eq(0)
      expect(response.status).to eq(204)
    end
  end
end

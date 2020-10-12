require 'rails_helper'

RSpec.describe "/v1/users/:user_id/symptom-surveys", type: :request do
  describe 'POST' do
    let(:user) { Fabricate(:user) }

    it "returns 401 if a user is not signed in" do
      post_json("/v1/users/#{user.id}/symptom-surveys", body: {
        medicalEvents: []
      })
      expect(response.status).to eq(401)
      expect(response_json).to have_key(:errors)
    end

    it "creates a cleared symptom survey" do
      post_json("/v1/users/#{user.id}/symptom-surveys", body: {
        medicalEvents: []
      }, user: user)

      expect(response_json).not_to have_key(:errors)
      expect(response_json).to have_key(:data)
      expect(response_json[:data][:attributes]).to include(status: 'cleared')
      expect(user.todays_greenlight_status.status).to eq(GreenlightStatus::CLEARED)
    end

    MedicalEvent::SYMPTOMS.each do |symptom|
      it "creates a pending symptom status for the symptom #{symptom}" do
        post_json("/v1/users/#{user.id}/symptom-surveys", body: {
          medicalEvents: [{
            eventType: symptom,
            occurredAt: Time.current.iso8601
          }]
        }, user: user)

        expect(response_json).not_to have_key(:errors)
        expect(response_json).to have_key(:data)
        expect(response_json[:data][:attributes]).to include(status: 'pending')
        expect(user.todays_greenlight_status.status).to eq(GreenlightStatus::PENDING)
      end
    end

    MedicalEvent::RECOVERY_TRIGGERS.each do |trigger|
      it "creates a recovery symptom status for the symptom #{trigger}" do
        post_json("/v1/users/#{user.id}/symptom-surveys", body: {
          medicalEvents: [{
            eventType: trigger,
            occurredAt: Time.current.iso8601
          }]
        }, user: user)

        expect(response_json).not_to have_key(:errors)
        expect(response_json).to have_key(:data)
        expect(response_json[:data][:attributes]).to include(status: 'recovery')
        expect(user.todays_greenlight_status.status).to eq(GreenlightStatus::RECOVERY)
      end
    end
  end
end
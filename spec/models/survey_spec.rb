# frozen_string_literal: true
require 'rails_helper'

RSpec.describe Survey, type: :model do
  let(:survey) { Fabricate :survey }

  describe '.send_to_locations' do
    let(:location) { Fabricate :location }
    let(:users) { 3.times.map { Fabricate :user } }

    before do
      users.each { |u| Fabricate(:location_account, user: u, location: location) }
    end

    subject { survey.send_to_locations([location.id]) }

    it 'sends to users of the location' do
      subject

      expect(SurveyResponse.count).to eq(3)
      expect(SendSurveyWorker.jobs.size).to eq(3)
      SendSurveyWorker.drain
    end

    it 'excludes already sent users' do
      users.first.survey_responses.build(survey: survey)
      users.first.save

      subject

      expect(SendSurveyWorker.jobs.size).to eq(2)
      SendSurveyWorker.drain
    end

    it 'registers the location and update last_sent_at' do
      subject

      expect(survey.location_ids).to eq([location.id])
      expect(survey.last_sent_at).to be_present
    end
  end
end

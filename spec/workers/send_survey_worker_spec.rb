# frozen_string_literal: true
require 'rails_helper'

RSpec.describe SendSurveyWorker do
  let!(:user) { Fabricate(:user) }
  let!(:survey) { Fabricate(:survey) }

  describe '#perform' do
    subject { SendSurveyWorker.new.perform(survey.id, user.id) }

    it 'sends survey email to the user' do
      subject

      last_delivery = Mail::TestMailer.deliveries.last
      expect(last_delivery[:to].to_s).to include(user.email)
      expect(last_delivery[:reply_to].to_s).to include(survey.permalink)
      expect(last_delivery.html_part.to_s).to include(survey.question)
    end

    it 'sends survey sms to the user' do
      subject

      expect(PlivoSMS.deliveries.last[:message]).to include(survey.question)
      expect(PlivoSMS.deliveries.last[:to]).to eq(user.mobile_number)
    end

    context 'takes user locale and' do
      let!(:user_es) { Fabricate(:user, locale: :es) }
      let!(:survey_es) { Fabricate(:full_survey) }

      it 'sends localized survey' do
        SendSurveyWorker.new.perform(survey_es.id, user_es.id)

        mail_sent = Mail::TestMailer.deliveries.last
        sms_sent = PlivoSMS.deliveries.last
        expect(mail_sent.html_part.to_s).to include(survey_es.question_es)
        expect(sms_sent[:message]).to include(survey_es.question_es)

        survey_es.choices_es.values.each do |label_es|
          expect(sms_sent[:message]).to include(label_es)
        end
      end

      it 'sends default EN survey when no local version' do
        SendSurveyWorker.new.perform(survey.id, user_es.id)

        sms_sent = PlivoSMS.deliveries.last
        expect(sms_sent[:message]).to include(survey.question)
        expect(sms_sent[:to]).to eq(user_es.mobile_number)

        survey.choices.values.each do |label|
          expect(sms_sent[:message]).to include(label)
        end
      end
    end
  end
end

# frozen_literal_string: true
require 'rails_helper'

RSpec.describe SurveyResponseRegister do
  let!(:survey) { Fabricate(:survey) }
  let!(:user) { Fabricate(:user, email: 'jeremy@greenlight.com', mobile_number: '+19167985029') }

  before do
    survey.survey_responses.build(user_id: user.id)
    survey.save
  end

  it 'registers a response from email' do
    register = SurveyResponseRegister.new(
      medium: :email,
      from: user.email,
      permalink: survey.permalink,
      response: '1',
    )
    register.run

    expect(register.result).to eq(true)
  end

  it 'registers a response from phone' do
    register = SurveyResponseRegister.new(
      medium: :phone,
      from: user.mobile_number,
      response: '1',
    )
    register.run

    expect(register.result).to eq(true)
  end

  context 'ignores a response' do
    it 'without the matching respondant (email)' do
      register = SurveyResponseRegister.new(
        medium: :email,
        from: 'daniel@greenlight.com',
        permalink: survey.permalink,
        response: '1',
      )
      register.run

      expect(register.result).to eq(false)
    end

    it 'without the matching respondant (phone)' do
      register = SurveyResponseRegister.new(
        medium: :phone,
        from: '+19199993085',
        response: '1',
      )
      register.run

      expect(register.result).to eq(false)
    end

    it 'without the matching survey (email)' do
      register = SurveyResponseRegister.new(
        medium: :email,
        from: user.email,
        permalink: "#{survey.permalink}1",
        response: '1',
      )
      register.run

      expect(register.result).to eq(false)
    end

    it 'without the matching survey (phone)' do
      SurveyResponse.destroy_all

      register = SurveyResponseRegister.new(
        medium: :phone,
        from: user.mobile_number,
        response: '1',
      )
      register.run

      expect(register.result).to eq(false)
    end

    it 'if it is not valid one' do
      register = SurveyResponseRegister.new(
        medium: :email,
        from: user.email,
        permalink: survey.permalink,
        response: '10',
      )
      register.run

      expect(register.result).to eq(false)
    end

    it 'if the response already exists' do
      SurveyResponseRegister.new(
        medium: :email,
        from: user.email,
        permalink: survey.permalink,
        response: '1',
      ).run

      register = SurveyResponseRegister.new(
        medium: :phone,
        from: user.mobile_number,
        response: '1',
      )
      register.run

      expect(register.result).to eq(false)
    end
  end
end

# frozen_string_literal: true
require 'rails_helper'

RSpec.describe PlivoSMS do
  let(:from) { valid_mobile_number }
  let(:to) { valid_mobile_number }

  context 'when sending an ASCII msg longer than 160' do
    let(:msg) {
      Faker::Alphanumeric.alphanumeric(
        number: Faker::Number.within(range: 161..180)
      )
    }
    subject { PlivoSMS.new(to: to, from: from, message: msg) }

    it 'raises a "TextTooLongError"' do
      expect { subject.work }.to raise_error(PlivoSMS::TextTooLongError)
    end
  end

  context 'when sending a UNICODE msg longer than 70' do
    let(:msg) { '密码很长，文本很快就会突破限制。'*10 }
    subject { PlivoSMS.new(to: to, from: from, message: msg) }

    it 'raises a "TextTooLongError"' do
      expect { subject.work }.to raise_error(PlivoSMS::TextTooLongError)
    end
  end
end

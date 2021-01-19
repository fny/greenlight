# frozen_string_literal: true
require 'rails_helper'

RSpec.describe InviteWorker do
  describe '#perform' do
    it 'sends a text to a user with a phone number' do
      @user = Fabricate(:user)
      InviteWorker.new.perform(@user.id)
      expect(PlivoSMS.deliveries.last[:message]).to include('registered you for Greenlight')
      expect(PlivoSMS.deliveries.last[:to]).to eq(@user.mobile_number)
    end
  end
end

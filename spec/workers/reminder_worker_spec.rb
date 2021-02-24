# frozen_string_literal: true
require 'rails_helper'

RSpec.describe ReminderWorker do
  fixtures :all

  let (:user) { users(:homer) }

  describe '#perform' do
    it 'sends a reminder to a user via email' do
      user.update(mobile_number: nil)
      expect(user.remind?).to eq(true)
      expect(user.remind_by_text?).to eq(false)
      expect(user.remind_by_email?).to eq(true)
      ReminderWorker.new.perform(user.id)
      expect(ActionMailer::Base.deliveries.size).to eq(1)
    end

    it "doesn't send a reminder twice" do
      expect(user.remind?).to eq(true)
      expect(user.remind_by_text?).to eq(true)
      expect(user.reminder_send_today?).to eq(false)
      start_size = PlivoSMS.deliveries.size
      ReminderWorker.new.perform(user.id)
      expect(PlivoSMS.deliveries.size - start_size).to eq(1)
      user.reload
      expect(user.reminder_send_today?).to eq(true)
      ReminderWorker.new.perform(user.id)
      expect(PlivoSMS.deliveries.size - start_size).to eq(1)
    end

    it "doesn't send a reminder if the user has disabled them": true do
      UserSettings.create!(user: user, override_location_reminders: true, daily_reminder_type: UserSettings::NONE)
      ReminderWorker.new.perform(user.id)
      expect(ActionMailer::Base.deliveries.size).to eq(0)
    end

    it "doesn't send a reminder if the user hasn't finished registration yet" do
      user.update(completed_welcome_at: nil)

      ReminderWorker.new.perform(user.id)
      expect(ActionMailer::Base.deliveries.size).to eq(0)
    end
  end
end

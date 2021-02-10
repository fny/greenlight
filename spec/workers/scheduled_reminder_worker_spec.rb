# frozen_string_literal: true
require 'rails_helper'

RSpec.describe ScheduledReminderWorker do
  fixtures :all
  let (:user) {
    homer = users(:homer)
    homer
  }

  describe '#reminder_hour' do
    it 'returns the current hour' do
      travel_to Time.find_zone('America/New_York').local(Time.current.year, Time.current.month, Time.current.day, user.daily_reminder_time) do
        expect(ScheduledReminderWorker.new.reminder_hour).to eq(user.daily_reminder_time)
      end
    end
  end

  describe '#reminder_day' do
    it 'returns the current hour' do
      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, 7) do
        expect(ScheduledReminderWorker.new.reminder_day).to eq(:remind_fri)
      end
    end
  end

  describe '#user_ids' do
    it 'returns an id when the location has the user set to be reminded' do
      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, user.daily_reminder_time) do
        expect(ScheduledReminderWorker.new.user_ids).to include(user.id)
      end
    end

    it 'does not return the id when user has not set up his account' do
      user.update(completed_welcome_at: nil)
      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, user.daily_reminder_time) do
        expect(ScheduledReminderWorker.new.user_ids).not_to include(user.id)
      end
    end

    it 'does not return the id when all the locations ahve reminders disabled' do
      user.locations.update_all(reminders_enabled: false)
      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, user.daily_reminder_time) do
        expect(ScheduledReminderWorker.new.user_ids).not_to include(user.id)
      end
    end

    it 'does not remind the user when they have disabled it' do
      UserSettings.create!(user: user, override_location_reminders: true, daily_reminder_type: 'none')
      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, user.daily_reminder_time) do
        expect(ScheduledReminderWorker.new.user_ids).not_to include(user.id)
      end
    end

    it 'does not the user when they have disabled reminders for a given day' do
      UserSettings.create!(user: user, override_location_reminders: true, remind_fri: false)
      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, user.daily_reminder_time) do
        expect(ScheduledReminderWorker.new.user_ids).not_to include(user.id)
      end
    end

    it 'reminds the user when they have set their own time' do
      UserSettings.create!(user: user, override_location_reminders: true, daily_reminder_time: 8)
      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, 7) do
        expect(ScheduledReminderWorker.new.user_ids).not_to include(user.id)
      end

      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, 8) do
        expect(ScheduledReminderWorker.new.user_ids).to include(user.id)
      end
    end
  end

  describe '#perform' do
    it 'sends a reminder to a user based on their preferred format' do
      travel_to Time.find_zone('America/New_York').local(2021, 1, 1, user.daily_reminder_time) do
        UserSettings.create!(user: user, daily_reminder_type: 'email')
        expect(ScheduledReminderWorker.new.user_ids).to include(user.id)
        ScheduledReminderWorker.perform_async
        Sidekiq::Worker.drain_all
        expect(ActionMailer::Base.deliveries.size).to eq(1)
      end
    end
  end
end

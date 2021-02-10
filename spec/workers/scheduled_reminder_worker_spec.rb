# frozen_string_literal: true
require 'rails_helper'

RSpec.xdescribe ScheduledReminderWorker do

  let (:user) {
    user = Fabricate(:user)
    location_account = Fabricate(:location_account)
    homer = users(:homer)
    homer.update(daily_reminder_type: 'email')
    homer
  }


  describe '#perform' do
    it 'sends a reminder to a user' do
      ScheduledReminderWorker.perform_async
      Sidekiq::Worker.drain_all
      expect(ActionMailer::Base.deliveries.size).to eq(1)
    end

    it 'sends a reminder if a user has at least one site with them enabled' do
      user.locations.first.update!(reminders_enabled: :false)
      ScheduledReminderWorker.perform_async
      Sidekiq::Worker.drain_all
      expect(ActionMailer::Base.deliveries.size).to eq(1)
    end

    it "doesn't send a reminder twice" do
      ScheduledReminderWorker.perform_async
      Sidekiq::Worker.drain_all
      ScheduledReminderWorker.perform_async
      Sidekiq::Worker.drain_all
      expect(ActionMailer::Base.deliveries.size).to eq(1)
    end

    it "doesn't send a reminder if the user has disabled them": true do
      UserSettings.create!(user: user, override_location_reminders: true, daily_reminder_type: UserSettings::NONE)
      user.update!(daily_reminder_type: User::NONE)
      ScheduledReminderWorker.perform_async
      Sidekiq::Worker.drain_all
      expect(ActionMailer::Base.deliveries.size).to eq(0)
    end

    it "doesn't send a reminder if all of a users locations and affiliated locations have disabled then" do
      user.affiliated_locations.each do |l|
        l.update!(reminders_enabled: :false)
      end
      ScheduledReminderWorker.perform_async
      Sidekiq::Worker.drain_all
      expect(ActionMailer::Base.deliveries.size).to eq(0)
    end

    it "doesn't send a reminder if the user hasn't finished registration yet" do
      user.update(completed_welcome_at: nil)
      ScheduledReminderWorker.perform_async
      Sidekiq::Worker.drain_all
      expect(ActionMailer::Base.deliveries.size).to eq(0)
    end
  end
end

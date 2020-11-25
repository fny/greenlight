# frozen_string_literal: true

class ScheduledReminderWorker < ApplicationWorker
  sidekiq_options retry: 3

  def perform
    current_time = Time.now.in_time_zone('America/New_York')

    reminder_query = {
      daily_reminder_time: current_time.hour,
    }

    reminder_day = REMINDER_DAYS[current_time.wday]
    reminder_query[reminder_day] = true

    user_ids = UserSettings.where(
      query
    ).where.not(
      daily_reminder_type: 'none',
      override_location_reminders: true
    ).pluck(:user_id).to_set

    user_ids_from_location = Location.where(
      query
    ).all.flat_map { |x| x.users_to_notify.to_a }.map(&:id)

    user_ids = user_ids.merge(user_ids_from_location)

    user_ids.map { |user_id| ReminderWorker.new.perform(user_id) }
  end
end

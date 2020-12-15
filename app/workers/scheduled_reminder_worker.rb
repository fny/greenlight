# frozen_string_literal: true

class ScheduledReminderWorker < ApplicationWorker
  REMINDER_DAYS = %i[
    remind_sun remind_mon remind_tue remind_wed remind_thu remind_fri remind_sat
  ].freeze

  sidekiq_options retry: 3

  def perform
    current_time = Time.now.in_time_zone('America/New_York')

    reminder_query = {
      daily_reminder_time: current_time.hour,
    }

    reminder_day = REMINDER_DAYS[current_time.wday]
    reminder_query[reminder_day] = true

    user_ids = UserSettings.where(
      reminder_query
    ).where.not(
      daily_reminder_type: 'none',
      override_location_reminders: true
    ).pluck(:user_id).to_set

    user_ids_from_location = Location.where(
      reminder_query
    ).all.flat_map { |x| x.users_to_notify.to_a }.map(&:id)

    user_ids = user_ids.merge(user_ids_from_location)

    user_ids.each { |user_id| ReminderWorker.perform_async(user_id) }
  end
end

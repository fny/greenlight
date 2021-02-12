# frozen_string_literal: true

class ScheduledReminderWorker < ApplicationWorker
  REMINDER_DAYS = %i[
    remind_sun remind_mon remind_tue remind_wed remind_thu remind_fri remind_sat
  ].freeze

  sidekiq_options retry: 2

  def current_time
    @current_time ||= Time.now.in_time_zone('America/New_York')
  end

  def reminder_hour
    current_time.hour
  end

  def reminder_day
    REMINDER_DAYS[current_time.wday]
  end

  def sql
    <<~SQL
      -- Users where the location's reminder time is for the current day and hour and does not have an override
      select u.id as user_id
      from location_accounts la, (select * from locations where daily_reminder_time = #{reminder_hour} and #{reminder_day} = true and reminders_enabled = true) as l, users u
      -- left outer join because not all users have settings
      left outer join user_settings us on u.id = us.user_id
      where l.id = la.location_id
      and u.id = la.user_id
      -- has completed registration
      and u.completed_welcome_at is not null
      -- doesn't have an override
      and (us.override_location_reminders = false or us.override_location_reminders is null)
      -- has contact info
      and (u.email is not null or u.mobile_number is not null)
      -- have not sent it already
      and (u.daily_reminder_sent_at is null or date(timezone('America/New_York', u.daily_reminder_sent_at)) != date(timezone('America/New_York', now())))
      union
      -- users with overrides
      select u.id as user_id
      from users u, user_settings us
      where u.id = us.user_id
      -- override enabled
      and us.override_location_reminders = true
      and us.daily_reminder_type != 'none'
      and us.daily_reminder_time = #{reminder_hour}
      -- send it today
      and us.#{reminder_day} = true
      -- have not sent it already
      and (u.daily_reminder_sent_at is null or date(timezone('America/New_York', u.daily_reminder_sent_at)) != date(timezone('America/New_York', now())))
      -- has completed registration
      and u.completed_welcome_at is not null
    SQL
  end

  def user_ids
    @user_ids ||= DB.query(sql).map(&:user_id)
  end

  def perform
    user_ids.each do |id|
      ReminderWorker.perform_async(id)
    end
  end
end

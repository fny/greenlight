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
      -- has been on the app within the last 30 days
      and DATE_PART('day', '#{Time.now.to_date}'::timestamp - u.last_seen_at::timestamp) <= 30
      union
      -- Parents without overrides
      select distinct parent_id as user_id from (
          select * from parents_children pc, location_accounts la, users u, locations l
          where u.id = pc.parent_id and la.user_id = pc.child_id and la.location_id = l.id
          -- has completed registration
          and u.completed_welcome_at is not null
          -- has contact info
          and (u.email is not null or u.mobile_number is not null)
          -- have not sent it already
          and la.location_id NOT IN (select id from locations where permalink = 'socrates-academy')
          and (u.daily_reminder_sent_at is null or date(timezone('America/New_York', u.daily_reminder_sent_at)) != date(timezone('America/New_York', now())))
          -- has been on the app within the last 30 days
          and DATE_PART('day', now() - u.last_seen_at) <= 30
      ) as x
      left outer join user_settings us on x.parent_id = us.user_id
      -- doesn't have an override
      where (us.override_location_reminders = false or us.override_location_reminders is null)
      -- location has reminders enabled for the current day and time
      and x.daily_reminder_time = #{reminder_hour}
      and x.#{reminder_day} = true
      and x.reminders_enabled = true
      union
      -- Users with overrides
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
      -- has been on the app within the last 30 days
      and DATE_PART('day', now() - u.last_seen_at) <= 30
    SQL
  end

  def user_ids
    @user_ids ||= DB.query(sql).map(&:user_id)
  end

  def distances
    @distances ||= DB.query(sql).map(&:distance)
  end

  def perform
    user_ids.each do |id|
      ReminderWorker.perform_async(id)
    end
  end
end

# TODO: Generalize
class ScheduledReminderWorker < ApplicationWorker
  def perform(location_permalink)
    location = Location.includes(
      :location_accounts,
      location_accounts: { user: :parents }).
      find_by!(permalink: location_permalink)

    users_to_notify = Set.new

    location.location_accounts.each do |la|
      if la.role.student?
        la.user.parents.each do |p|
          users_to_notify.add(p)
        end
      else
        users_to_notify.add(la.user)
      end
    end

    users_to_notify.each do |u|
      if u.completed_invite_at
        ReminderWorker.perform_async(u.id)
      else
        InviteWorker.perform_async(u.id)
      end
      
    end
  end
end

Sidekiq::Cron::Job.create(
  name: 'Greenlight Reminders',
  cron: 'every day at 3:33pm',
  class: 'ScheduledReminderWorker',
  args: [
    'greenlight'
  ]
)

Sidekiq::Cron::Job.create(
  name: 'WG Pearson Reminders',
  cron: 'every day at 7:15am',
  class: 'ScheduledReminderWorker',
  args: [
    'wg-pearson'
  ]
)

# frozen_string_literal: true
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
      if u.completed_welcome_at
        ReminderWorker.perform_async(u.id)
      else
        InviteWorker.perform_async(u.id)
      end
    end
  end
end

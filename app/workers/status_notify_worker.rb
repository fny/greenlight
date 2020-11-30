# frozen_string_literal: true
class StatusNotifyWorker < ApplicationWorker
  def perform(user_id, status, notify_except = nil)
    user = User.find(user_id)
    locations = user.locations.includes(:location_accounts)

    users_to_notify = Set.new

    locations.map(&:location_accounts).flatten.each do |la|
      if la.permission_level.admin? &&
        la.user.id != notify_except &&
        la.user.id != user_id
        users_to_notify.add(la.user)
      end
    end

    users_to_notify.each do |u|
      next unless u.email?

      NotifyWorker.perform_async(u.id, user_id, status)
    end
  end
end

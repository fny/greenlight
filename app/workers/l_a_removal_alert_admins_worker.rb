# frozen_string_literal: true
class LARemovalAlertAdminsWorker < ApplicationWorker
  def perform(location_id, user_id)
    user = User.find(user_id)
    location = Location.includes(:location_accounts).find(location_id)

    admins_to_notify = Set.new
    location.location_accounts.each do |la|
      if la.permission_level.admin? && la.user.id != user_id
        admins_to_notify.add(la.user)
      end
    end

    admins_to_notify.each do |admin|
      next unless admin.email?

      LARemovalAlertUserWorker.perform_async(admin.id, location_id, user_id)
    end
  end
end

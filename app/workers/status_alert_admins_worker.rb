# frozen_string_literal: true
class StatusAlertAdminsWorker < ApplicationWorker
  def perform(symptom_holder_id, status, reporter = nil)
    symptom_holder = User.find(symptom_holder_id)
    locations = symptom_holder.locations.includes(:location_accounts)

    users_to_notify = Set.new

    locations.map(&:location_accounts).flatten.each do |la|
      if la.permission_level.admin? &&
        la.user.id != reporter &&
        la.user.id != symptom_holder_id
        users_to_notify.add(la.user)
      end
    end

    users_to_notify.each do |u|
      next unless u.email?

      StatusAlertUserWorker.perform_async(u.id, symptom_holder_id, status)
    end
  end
end

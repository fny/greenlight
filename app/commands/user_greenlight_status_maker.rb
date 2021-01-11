# Generates random Greenlight Statuses for the given user over the dates given.
#
class UserGreenlightStatusMaker < ApplicationCommand
  argument :user
  argument :start_date
  argument :end_date

  WEIGHTED_STATUSES = {
    GreenlightStatus::CLEARED => 90,
    GreenlightStatus::PENDING => 1,
    GreenlightStatus::RECOVERY => 1,
    GreenlightStatus::UNKNOWN => 8,
  }.freeze

  def generate_status
    normalized = WEIGHTED_STATUSES.transform_values { |v| v.to_f / WEIGHTED_STATUSES.values.sum }
    normalized.max_by { |_, weight| rand ** (1.0 / weight) }.first
  end

  def event_for_status(status)
    case status
    when 'pending'
      MedicalEvent::SYMPTOMS.sample
    when 'recovery'
      MedicalEvent::RECOVERY_TRIGGERS.sample
    end
  end

  def work
    ActiveRecord::Base.transaction do
      dates = ((start_date || 10.days.ago.to_date)..(end_date || Date.current)).to_a
      dates.each do |date|
        status = generate_status
        next if status == GreenlightStatus::UNKNOWN

        GreenlightStatus.create!(
          user: user,
          submission_date: date,
          expiration_date: date + 1.day,
          follow_up_date: date + 1.day,
          status: generate_status,
          medical_events: [
            MedicalEvent.new(
              occurred_at: date,
              event_type: event_for_status(status)
            )
          ].reject { |e| e.event_type.nil? }
        )
      end
    end
  end
end

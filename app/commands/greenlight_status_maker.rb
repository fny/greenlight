# Generates random Greenlight Statuses for the given user over the dates given.
#
class GreenlightStatusMaker < ApplicationCommand
  WEIGHTED_STATUSES = {
    GreenlightStatus::CLEARED => 70,
    GreenlightStatus::PENDING => 20,
    GreenlightStatus::RECOVERY => 20,
    GreenlightStatus::UNKNOWN => 2,
  }.freeze

  argument :user
  argument :start_date
  argument :end_date

  def self.run_for_location(location, start_date = nil, end_date = nil)
    location.users.map { |u|
      GreenlightStatusMaker.new(user: u, start_date: start_date, end_date: end_date).run
    }
  end

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

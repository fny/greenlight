# frozen_string_literal: true
class SymptomSurvey
  include ActiveModel::Model

  attr_accessor :user, :medical_events, :created_by, :is_override
  attr_reader :greenlight_status

  validates :user, presence: true
  validates :created_by, presence: true
  validate :medical_events_present

  def strategy
    prev_medical_events = user.medical_events.where('occurred_at >= ?', 14.days.ago)
    last_cleared_overrie_date = user.recent_cleared_override&.submission_date
    @strategy ||= GreenlightStrategyNorthCarolina.new(
      medical_events.map { |e| MedicalEvent.new(e) },
      prev_medical_events,
      last_cleared_overrie_date
    )
  end

  def save
    self.santize_medical_events()
    @greenlight_status = strategy.status
    @greenlight_status.created_by = created_by
    @greenlight_status.user = user
    @greenlight_status.is_override = true if is_override
    @greenlight_status.save
  end

  private

  def medical_events_present
    if self.medical_events.nil?
      errors.add(:medical_events, :blank)
    end
  end

  def santize_medical_events
    @medical_events = medical_events.map { |e| e.slice(:event_type, :occurred_at) }
  end
end

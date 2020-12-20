# frozen_string_literal: true
class MedicalEvent < ApplicationRecord
  EVENT_TYPES = [
    FEVER = 'fever',
    NEW_COUGH = 'new_cough',
    DIFFICULTY_BREATING = 'difficulty_breathing',
    LOST_TASTE_SMELL = 'lost_taste_smell',
    CHILLS = 'chills',
    COVID_EXPOSURE = 'covid_exposure',
    COVID_TEST_TAKEN = 'covid_test_taken',
    COVID_TEST_POSITIVE = 'covid_test_positive',
    COVID_TEST_NEGATIVE = 'covid_test_negative',
    COVID_DIAGNOSIS = 'covid_diagnosis',
    COVID_RULED_OUT = 'covid_ruled_out',
    SYMPTOM_IMPROVEMENT = 'symptom_improvement'
  ]

  HAS_COVID = [
    COVID_TEST_POSITIVE,
    COVID_DIAGNOSIS
  ]

  SYMPTOMS = [
    FEVER,
    NEW_COUGH,
    DIFFICULTY_BREATING,
    LOST_TASTE_SMELL,
    CHILLS
  ]

  PENDING_TRIGGERS = [
    *SYMPTOMS
  ]

  RECOVERY_TRIGGERS = [
    COVID_EXPOSURE,
    COVID_TEST_POSITIVE,
    COVID_DIAGNOSIS
  ]

  extend Enumerize
  enumerize :event_type, in: EVENT_TYPES

  belongs_to :user
  belongs_to :created_by, class_name: 'User'
  belongs_to :greenlight_status

  validates :user, presence: true
  validates :event_type, presence: true
  validates :occurred_at, presence: true

  scope :recently_created, -> { where(created_at: 20.days.ago.beginning_of_day..Time.zone.now.end_of_day) }

  def fever?
    self.event_type == FEVER
  end

  def cough?
    self.event_type == NEW_COUGH
  end

  def breathing_issues?
    self.event_type == DIFFICULTY_BREATING
  end

  def has_covid?
    HAS_COVID.include?(self.event_type)
  end

  def triggers_recovery?
    RECOVERY_TRIGGERS.inlcude?(self.event_type)
  end

  def test_result?
    [COVID_TEST_NEGATIVE, COVID_TEST_POSITIVE].include?(self.event_type)
  end

  def symptom?
    SYMPTOMS.include?(self.event_type)
  end
end

# == Schema Information
#
# Table name: medical_events
#
#  id                   :bigint           not null, primary key
#  user_id              :bigint           not null
#  greenlight_status_id :bigint           not null
#  event_type           :string           not null
#  occurred_at          :datetime         not null
#  created_by_id        :bigint
#  updated_by_id        :bigint
#  deleted_by_id        :bigint
#  deleted_at           :datetime
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#
# Indexes
#
#  index_medical_events_on_created_by_id         (created_by_id)
#  index_medical_events_on_deleted_by_id         (deleted_by_id)
#  index_medical_events_on_event_type            (event_type)
#  index_medical_events_on_greenlight_status_id  (greenlight_status_id)
#  index_medical_events_on_updated_by_id         (updated_by_id)
#  index_medical_events_on_user_id               (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (deleted_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (greenlight_status_id => greenlight_statuses.id) ON DELETE => cascade
#  fk_rails_...  (updated_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#

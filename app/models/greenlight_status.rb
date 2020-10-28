# frozen_string_literal: true
class GreenlightStatus < ApplicationRecord
  # @!attribute submission_date
  #   @return [Date] The date on this status is effective.

  # @!attribute follow_up_date
  #   @return [Date] The date a new status is preferred.

  # @!attribute expiration_date
  #   @return [String] The last date a status is valid.

  DAILY_CUT_OFF = CutoffTime.new(Time.parse('6 PM'))

  STATUSES = [
    CLEARED = 'cleared',
    PENDING = 'pending',
    RECOVERY = 'recovery',
    ABSENT = 'absent',
    UNKNOWN = 'unknown'
  ]

  REASONS = [
    'cleared',
    'cleared_alternative_diagnosis',
    'cleared_with_symptom_improvement',
    'pending_needs_diagnosis',
    'recovery_covid_exposure',
    'recovery_asymptomatic_covid_exposure',
    'recovery_from_diagnosis',
    'recovery_not_covid_has_fever',
    'recovery_diagnosed_asymptomatic',
    'recovery_return_tomorrow'
]

  extend Enumerize
  enumerize :status, in: STATUSES
  enumerize :reason, in: REASONS
  belongs_to :user
  belongs_to :created_by, class_name: 'User'
  scope :submitted_for_today, -> { where('submission_date <= ?', Time.zone.today).where('follow_up_date > ?', Time.zone.today) }
  scope :submitted_for_cuttoff, -> { where('submission_date <= ?', DAILY_CUT_OFF.round(Time.now) ).where('follow_up_date > ?', DAILY_CUT_OFF.round(Time.now)) }
  scope :recently_created, -> { where(created_at: 20.days.ago.beginning_of_day..Time.zone.now.end_of_day) }
  scope :not_expired, -> { where('expiration_date <= ?', Time.current.to_date) }
  has_many :medical_events

  before_validation :assign_associated_users_to_medical_events

  validates :user, presence: true
  validates :submission_date, presence: true
  validates :follow_up_date, presence: true
  validates :expiration_date, presence: true

  validate :not_already_submitted

  def expired?
    Time.current.to_date > expiration_date
  end

  def cleared_override?
    self.is_override && status == CLEARED
  end

  def submitted_at=(time)
    self.submission_date = time.to_date
    self.follow_up_date = DAILY_CUT_OFF.round(time) + 1.day
  end

  def assign_associated_users_to_medical_events
    medical_events.each { |e|
      e.created_by = self.created_by
      e.user = self.user
    }
  end

  def not_already_submitted
    return if self.is_override
    if GreenlightStatus.submitted_for_cuttoff.where(user: user).exists?
      errors.add(:base, 'status_already_submitted')
    end
  end

end

# == Schema Information
#
# Table name: greenlight_statuses
#
#  id              :bigint           not null, primary key
#  user_id         :bigint           not null
#  status          :text             not null
#  submission_date :date             not null
#  expiration_date :date             not null
#  follow_up_date  :date             not null
#  reason          :text
#  logical_trace   :text
#  is_override     :boolean          default(FALSE), not null
#  created_by_id   :bigint
#  deleted_by_id   :bigint
#  deleted_at      :datetime
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_greenlight_statuses_on_created_by_id  (created_by_id)
#  index_greenlight_statuses_on_deleted_by_id  (deleted_by_id)
#  index_greenlight_statuses_on_status         (status)
#  index_greenlight_statuses_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (deleted_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#

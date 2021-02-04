# frozen_string_literal: true

class SurveyResponse < ApplicationRecord
  extend Enumerize

  MEDIUMS = [
    EMAIL = 'email',
    PHONE = 'phone',
  ].freeze

  enumerize :medium, in: MEDIUMS

  belongs_to :survey
  belongs_to :user

  validates :user_id, uniqueness: { scope: :survey_id }

  scope :not_answered, -> { where(responded_at: nil) }
  scope :answered, -> { where.not(responded_at: nil) }
  scope :at_locations, -> (locations) {
    joins(user: :locations).where(locations: { id: locations })
  }
end

# == Schema Information
#
# Table name: survey_responses
#
#  id           :bigint           not null, primary key
#  user_id      :bigint           not null
#  survey_id    :bigint           not null
#  response     :string
#  medium       :string
#  responded_at :datetime
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
# Indexes
#
#  index_survey_responses_on_survey_id              (survey_id)
#  index_survey_responses_on_survey_id_and_user_id  (survey_id,user_id) UNIQUE
#  index_survey_responses_on_user_id                (user_id)
#

# frozen_string_literal: true

class Survey < ApplicationRecord
  extend Enumerize

  QUESTION_TYPES = [
    CHOICES = 'choices',
    PLAIN = 'plain',
  ].freeze

  before_save :make_it_permalink, if: :new_record?

  enumerize :question_type, in: QUESTION_TYPES, default: CHOICES

  has_many :survey_responses
  has_many :users, -> { distinct }, through: :survey_responses

  validates :question, presence: true

  # locations that the survey is sent to
  def locations
    Location.where(id: location_ids)
  end

  def send_to_locations(location_ids)
    target_users = User.joined(location_ids).with_contact_method
                  .where.not(id: self.users.pluck(:id))
    send_to_users(target_users.pluck(:id))

    update(
      location_ids: (self.location_ids + location_ids.map(&:to_i)).uniq,
      last_sent_at: DateTime.now,
    )
  end

  def send_to_users(user_ids)
    user_ids.each do |user_id|
      self.survey_responses.build(user_id: user_id)
      # trigger sender job
      SendSurveyWorker.perform_async(id, user_id)
    end

    save
  end

  def valid_response?(response)
    choices.keys.include? response
  end

  def choices_str
    choices.values.join(', ')
  end

  def choices_str=(str)
    self.choices = choices_str_to_hash(str)
  end

  def choices_es_str
    choices_es.values.join(', ')
  end

  def choices_es_str=(str)
    self.choices_es = choices_str_to_hash(str)
  end

  def locale_question(locale)
    if locale == 'es'
      return question_es || question
    end

    question
  end

  def locale_choices(locale)
    if locale == 'es'
      return choices_es.keys.length == choices.keys.length ? choices_es : choices
    end

    choices
  end

  private

  def choices_str_to_hash(str)
    labels = str.split(',').map(&:strip)
    labels.each.with_index.reduce({}) do |hash, (label, index)|
      hash.merge({
        "#{index+1}" => label,
      })
    end
  end

  def make_it_permalink
    self.permalink = SecureRandom.urlsafe_base64(10)
  end
end

# == Schema Information
#
# Table name: surveys
#
#  id            :bigint           not null, primary key
#  question      :string           not null
#  question_es   :string
#  question_type :string           default("choices"), not null
#  choices       :jsonb
#  choices_es    :jsonb
#  location_ids  :jsonb
#  last_sent_at  :datetime
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  permalink     :string
#

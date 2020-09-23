# == Schema Information
#
# Table name: medical_events
#
#  id            :uuid             not null, primary key
#  event_type    :text             not null
#  occurred_at   :datetime         not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  created_by_id :uuid
#  user_id       :uuid             not null
#
# Indexes
#
#  index_medical_events_on_created_by_id  (created_by_id)
#  index_medical_events_on_event_type     (event_type)
#  index_medical_events_on_user_id        (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
class MedicalEvent < ApplicationRecord
  belongs_to :user
  belongs_to :created_by, class_name: 'User'
  
  scope :recently_created, -> { where(created_at: 20.days.ago.beginning_of_day..Time.zone.now.end_of_day) }
end
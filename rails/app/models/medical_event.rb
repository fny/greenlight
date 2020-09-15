# == Schema Information
#
# Table name: medical_events
#
#  id          :uuid             not null, primary key
#  event_type  :text             not null
#  occurred_at :datetime         not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :uuid             not null
#
# Indexes
#
#  index_medical_events_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
class MedicalEvent < ApplicationRecord
  belongs_to :user
end

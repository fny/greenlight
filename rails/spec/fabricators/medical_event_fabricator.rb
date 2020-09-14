# == Schema Information
#
# Table name: medical_events
#
#  id         :uuid             not null, primary key
#  event_type :text             not null
#  occured_at :datetime         not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :uuid             not null
#
# Indexes
#
#  index_medical_events_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#
Fabricator(:medical_event) do
  event_type "MyText"
  occured_at "2020-09-14 17:59:45"
end

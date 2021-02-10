# frozen_string_literal: true

class UserSettings < ApplicationRecord
  extend Enumerize

  DAILY_REMINDER_TYPES = [
    TEXT = 'text',
    EMAIL = 'email',
    NONE = 'none'
  ].freeze

  enumerize :daily_reminder_type, in: DAILY_REMINDER_TYPES

  belongs_to :user

  before_create :match_reminder_type_to_user_contact

  def match_reminder_type_to_user_contact
    if user.mobile_number?
      TEXT
    elsif user.email?
      EMAIL
    else
      NONE
    end
  end
end

# == Schema Information
#
# Table name: user_settings
#
#  id                          :bigint           not null, primary key
#  user_id                     :bigint           not null
#  override_location_reminders :boolean          default(FALSE), not null
#  daily_reminder_type         :string           default("text"), not null
#  daily_reminder_time         :integer          default(7), not null
#  remind_mon                  :boolean          default(TRUE), not null
#  remind_tue                  :boolean          default(TRUE), not null
#  remind_wed                  :boolean          default(TRUE), not null
#  remind_thu                  :boolean          default(TRUE), not null
#  remind_fri                  :boolean          default(TRUE), not null
#  remind_sat                  :boolean          default(TRUE), not null
#  remind_sun                  :boolean          default(TRUE), not null
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#
# Indexes
#
#  index_user_settings_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id) ON DELETE => cascade
#

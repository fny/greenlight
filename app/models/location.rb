# frozen_string_literal: true

class Location < ApplicationRecord
  extend Enumerize

  CATEGORIES =  [
    BUSINESS = 'business',
    SCHOOL = 'school',
    CLINIC = 'clinic',
    COMMUNITY = 'community',
    CONSTRUCTION_SITE = 'construction_site',
    GROUP = 'group',
    HOSPITAL = 'hospital',
    HOTEL = 'hotel',
    NONPROFIT = 'nonprofit',
    ORGANIZATION = 'organization',
    PLACE_OF_WORSHIP = 'place_of_worship',
    RESTAUARNT = 'restaurant',
    SHELTER = 'shelter',
    STORE = 'store',
    THEATER = 'theater',
    UNIVERSITY = 'university',
    LOCATION = 'location',
    UNKNONW = 'unknown'
  ].freeze

  self.permitted_params = %i[
    name category permalink phone_number email website zip_code hidden
    employee_count
    daily_reminder_time
    remind_mon remind_tue remind_wed remind_thu remind_fri remind_sat remind_sun
  ]

  self.queryable_columns = %i[
    name
    permalink
    category
  ]

  belongs_to :created_by, class_name: 'User', optional: true
  has_many :location_accounts
  has_many :cohorts
  has_many :users, through: :location_accounts

  # has_many :students,
  # has_many :teachers
  # has_many :staff

  enumerize :category, in: CATEGORIES

  validate :registration_codes_are_different

  validates :name, presence: true
  validates :category, presence: true
  validates :permalink, presence: true, uniqueness: true, format: {
    with: /\A[a-z0-9-]+\z/
  },
  length: { minimum: 3 }

  validates :phone_number, phone: { countries: :us }, allow_nil: true
  validates :registration_code, presence: true
  validates :registration_code_downcase, presence: true
  validates :student_registration_code, presence: true
  validates :student_registration_code_downcase, presence: true
  before_validation :set_registration_codes


  def self.find_by_id_or_permalink(id)
    find_by(id: id) || find_by(permalink: id)
  end

  def self.find_by_id_or_permalink!(id)
    find_by_id_or_permalink(id) ||
      raise(ActiveRecord::RecordNotFound, "Location could not be found by #{id}")
  end

  def self.load_locations_from_data!
    Greenlight::Data.load_json('locations.json').each do |l|
      next if Location.exists?(permalink: l['permalink'])

      Location.create!(l)
    end
  end

  def phone_number=(value)
    return if value.blank?

    parsed = PhoneNumber.parse(value)
    parsed = nil if parsed.blank?
    self[:phone_number] = parsed
  end

  def users_to_invite
    users_to_notify.filter { |u| u.completed_welcome_at.blank? }
  end

  # We send reminders to users who have finished the welcome sequence
  def users_to_remind
    users_to_notify.filter { |u| u.completed_welcome_at.present? && !u.submitted_for_today? }
  end

  def remind_users
    users_to_remind.each { |u| ReminderWorker.perform_async(u.id) }
    true
  end

  def invite_users
    users_to_invite.each { |u| InviteWorker.perform_async(u.id) }
    true
  end

  def remind_users_now
    users_to_remind.each { |u| ReminderWorker.new.perform(u.id) }
    true
  end

  def invite_users_now
    users_to_invite.each { |u| InviteWorker.new.perform(u.id) }
    true
  end

  def registration_code=(code)
    self[:registration_code] = code
    self.registration_code_downcase = code.downcase
  end

  def student_registration_code=(code)
    self[:student_registration_code] = code
    self.student_registration_code_downcase = code.downcase
  end

  # Any users that should recieve a notification
  def users_to_notify
    location = Location.includes(
      :location_accounts,
      location_accounts: { user: :parents },
    ).find(self.id)

    users_to_notify = Set.new

    location.location_accounts.each do |la|
      if la.role.student?
        la.user.parents.each do |p|
          users_to_notify.add(p)
        end
      else
        users_to_notify.add(la.user)
      end
    end
    users_to_notify
  end

  def generate_registration_code
    thing = RandomWords.things.capitalize
    color = RandomWords.colors.capitalize
    number = (SecureRandom.random_number(9e1) + 1e1).to_i
    # letter = (('a'..'z').to_a - ['l']).sample
    "#{color}#{thing}#{number}"
  end

  #
  # FIXME: We need a database constraint here. There's a change two codes
  # will clash.
  #

  def refresh_registration_codes!
    code1, code2 = generate_two_unique_codes
    update_columns({ # rubocop:disable Rails/SkipsModelValidations
      registration_code: code1,
      registration_code_downcase: code1.downcase,
      student_registration_code: code2,
      student_registration_code_downcase: code2.downcase
    })
  end

  def refresh_student_registration_codes!
    code = generate_registration_code
    code = generate_registration_code while code == self.registration_code

    update_columns({ # rubocop:disable Rails/SkipsModelValidations
      student_registration_code: code,
      student_registration_code_downcase: code.downcase
    })
  end

  def import_staff_from_gdrive!(gdrive_id)
    file_path = Greenlight::Data.fetch_gdrive(gdrive_id, 'xlsx')
    @rimport = StaffImport.new(self, file_path)
    @rimport.process_rows!
  end

  def greenlight_welcome_url
    "#{Greenlight::SHORT_URL}/go/#{permalink}"
  end

  def gdrive_staff_roster_url
    return nil unless gdrive_staff_roster_id

    "https://docs.google.com/spreadsheets/d/#{gdrive_staff_roster_id}"
  end

  def gdrive_student_roster_url
    return nil unless gdrive_student_roster_id

    "https://docs.google.com/spreadsheets/d/#{gdrive_student_roster_id}"
  end

  private

  def registration_codes_are_different
    if self.registration_code == self.student_registration_code
      errors.add(:registration_code, 'matches student registration code')
    end
  end

  def set_registration_codes
    code1, code2 = generate_two_unique_codes
    self.registration_code = code1 unless self.registration_code
    self.student_registration_code = code2 unless self.student_registration_code
  end

  def generate_two_unique_codes
    loop do
      code1 = generate_registration_code
      code2 = generate_registration_code
      next if code1 == code2

      return [code1, code2]
    end
  end
end

# == Schema Information
#
# Table name: locations
#
#  id                                 :bigint           not null, primary key
#  name                               :string           not null
#  category                           :string           not null
#  permalink                          :string           not null
#  phone_number                       :string
#  email                              :string
#  website                            :string
#  zip_code                           :string
#  hidden                             :boolean          default(TRUE), not null
#  created_at                         :datetime         not null
#  updated_at                         :datetime         not null
#  daily_reminder_time                :integer          default(7), not null
#  remind_mon                         :boolean          default(TRUE), not null
#  remind_tue                         :boolean          default(TRUE), not null
#  remind_wed                         :boolean          default(TRUE), not null
#  remind_thu                         :boolean          default(TRUE), not null
#  remind_fri                         :boolean          default(TRUE), not null
#  remind_sat                         :boolean          default(TRUE), not null
#  remind_sun                         :boolean          default(TRUE), not null
#  employee_count                     :integer
#  approved_at                        :datetime
#  created_by_id                      :bigint
#  registration_code                  :string
#  registration_code_downcase         :string
#  student_registration_code          :string
#  student_registration_code_downcase :string
#  gdrive_staff_roster_id             :string
#  gdrive_student_roster_id           :string
#  cohort_schema                      :jsonb            not null
#
# Indexes
#
#  index_locations_on_created_by_id  (created_by_id)
#  index_locations_on_permalink      (permalink) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id)
#

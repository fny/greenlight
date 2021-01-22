# frozen_string_literal: true

class Location < ApplicationRecord
  extend Enumerize

  CATEGORIES = [
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
    UTILITY = 'utility',
    LOCATION = 'location',
    UNKNOWN = 'unknown'
  ].freeze

  self.permitted_params = %i[
    name category permalink phone_number email website zip_code hidden
    employee_count
    daily_reminder_time
    remind_mon remind_tue remind_wed remind_thu remind_fri remind_sat remind_sun
    reminders_enabled
  ]

  self.queryable_columns = %i[
    name
    permalink
    category
  ]

  belongs_to :created_by, class_name: 'User', optional: true
  has_many :location_accounts
  has_many :cohorts
  has_many :users, -> { distinct }, through: :location_accounts

  LocationAccount::ROLES.each do |role|
    has_many "#{role}_accounts".to_sym, -> { where(role: role) }, class_name: 'LocationAccount'
    has_many role.pluralize.to_sym, through: "#{role}_accounts".to_sym, source: :user
  end

  enumerize :category, in: CATEGORIES

  validate :registration_codes_are_different

  validates :name, presence: true
  validates :category, presence: true
  validates :permalink, presence: true, uniqueness: true,
    format: {
      with: /\A[a-z0-9-]+\z/
    },
    length: { minimum: 3 }

  validates :phone_number, phone: { countries: :us }, allow_nil: true
  validates :registration_code, presence: true
  validates :registration_code_downcase, presence: true
  validates :student_registration_code, presence: true
  validates :student_registration_code_downcase, presence: true
  validates :zip_code, format: { with: /\A\d{5}(-\d{4})?\z/ }, presence: true

  before_validation :set_registration_codes
  before_save :sync_cohorts!

  def self.find_by_id_or_permalink(id)
    find_by(id: id) || find_by(permalink: id)
  end

  def self.find_by_id_or_permalink!(id)
    find_by_id_or_permalink(id) ||
      raise(ActiveRecord::RecordNotFound, "Location could not be found by #{id}")
  end

  def self.handle_taken?(handle)
    Location.exists?(permalink: handle)
  end

  # Assigns the phone number and formats it in e164 format.
  # If the value isn't a phone number, nil is assigned.
  #
  # @param [String] value - the string to attempt to assign
  def phone_number=(value)
    return if value.blank?

    parsed = PhoneNumber.parse(value)
    parsed = nil if parsed.blank?
    self[:phone_number] = parsed
  end

  def parents
    User.distinct.parents.joins(:children).where('parents_children.child_id': students)
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

  def registration_type(code)
    code_ = code.strip.downcase
    if category != SCHOOL && code_ == registration_code
      return :staff
    end
    if category == SCHOOL && code_ == student_registration_code
      return :student_parent
    end
    if category == SCHOOL && code_ == registration_code
      return :teacher_staff
    end
    return :invalid
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

  def downcased_cohort_schema
    return cohort_schema if cohort_schema.blank?
    parsed = cohort_schema.is_a?(String) ? JSON.parse(cohort_schema) : cohort_schema
    parsed.transform_keys(&:downcase).transform_values { |v| v.map(&:downcase) }
  end

  def valid_cohort_category?(category)
    downcased_cohort_schema.key?(category.tr('#', '').downcase)
  end

  # Returns the number of users that have a specific status for the last 7
  # days. Results come in a hash keyed by date (YYYY-MM-DD) and status
  # (GreenlightStatus::STATUSES).
  #
  # For example `{ '2021-01-01' => { 'cleared' => 100, ... }}`
  #
  # @param [Date, Time, Datetime] date the date to start the lookback
  # @return [Hash]
  def status_breakdown(date = nil)
    start_date = (date - 7.days).to_date
    total_users = users.count
    values = GreenlightStatus.where(user: self.users).where('submission_date >= ?', start_date).group(:submission_date, :status).order('submission_date DESC').count
    result = {}
    values.each do |k, v|
      date, state = k
      result[date] ||= {}
      result[date][state] = v
    end
    result.each do |k, v|
      result[k]['unknown'] = total_users - v.values.sum
    end
    result
  end

  # Updates the cohorts to match the ones in the schema
  def sync_cohorts!
    coded = coded_cohort_schema
    schema_codes = Set.new(coded.keys)
    existing_codes = Set.new(cohorts.pluck(:code).to_a)
    codes_to_add = schema_codes - existing_codes
    codes_to_remove = existing_codes - schema_codes

    ActiveRecord::Base.transaction do
      Cohort.where(code: codes_to_remove).destroy_all
      self.cohorts << codes_to_add.map { |code|
        category, name = coded[code]
        Cohort.new(category: category, name: name)
      }
    end
  end

  private

  def coded_cohort_schema
    parsed = cohort_schema.is_a?(String) ? JSON.parse(cohort_schema) : cohort_schema
    codes = {}
    parsed.each do |category, names|
      names.each do |name|
        codes[Cohort.format_code(category, name)] = [category, name]
      end
    end
    codes
  end

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
#  reminders_enabled                  :boolean          default(TRUE), not null
#
# Indexes
#
#  index_locations_on_created_by_id  (created_by_id)
#  index_locations_on_permalink      (permalink) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (created_by_id => users.id) ON DELETE => nullify
#

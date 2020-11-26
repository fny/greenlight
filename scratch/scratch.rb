# frozen_string_literal: true
# Create Kevin

# Manually update phone numbers by email for staff

HEADERS = [
    UID = "Unique Id*",
    FIRST = "First Name*",
    LAST = "Last Name*",
    EMAIL = "Email*",
    PHONE = "Mobile Number*",
    ROLE = "Role*",
    TITLE = "Title",
    PERMISSION = "Permission Level"
  ]

sheet = Creek::Book.new('data/locations/wg-pearson/staff.xlsx').sheets[0]
sheet.rows.each do |row|
  r = Hash[HEADERS.zip(row.values)]
  u = User.find_by(email: r[EMAIL])
  u.update(mobile_number: r[PHONE]) if u
end

# Manually update phone numbers by email for roster
HEADERS = [
  UID = "Unique Id*",
  SFIRST = "Student First Name*",
  SLAST = "Student Last Name*",
  SBDATE = "Student Birth Date",
  P1FIRST = "Parent 1 First Name*",
  P1LAST = "Parent 1 Last Name*",
  P1EMAIL = "Parent 1 Email",
  P1PHONE = "Parent 1 Mobile Number*",
  P2FIRST = "Parent 2 First Name",
  P2LAST = "Parent 2 Last Name",
  P2EMAIL = "Parent 2 Email",
  P2PHONE = "Parent 2 Mobile Number"
]

sheet = Creek::Book.new('data/locations/wg-pearson/roster.xlsx').sheets[0]
sheet.rows.each do |row|
  r = Hash[HEADERS.zip(row.values)]
  next unless r[P1EMAIL].present? && r[P1EMAIL].include?('@')
  u = User.find_by(email: r[P1EMAIL])
  next unless u
  u.mobile_number = r[P1PHONE]
  u.save!
end

u = User.create(
  first_name: 'Kevin',
  last_name: "O'Keefe",
  mobile_number: '+17082121437'
)

l = LocationAccount.create({
  user_id: u.id,
  location: Location.find_by_id_or_permalink('greenlight'),
  role: 'teacher',
  permission_level: 'none'
})

parents.each do |p|
  next unless p[:email]
  u = User.find_by(email: p[:email])
  next unless u
  u.mobile_number = p[:mobile_number]
  u.save
end

# Creating a volunteer account for Cathi Sander @ Student U
u = User.create(
  first_name: 'Volunteer',
  last_name: 'WG Pearson',
  email: 'volunteer@dpsvmc.org',
  password: 'CleverOrange55*'
)

l = LocationAccount.create({
  user_id: u.id,
  location: Location.find_by_id_or_permalink('wg-pearson'),
  role: 'staff',
  permission_level: 'admin'
})

# Create user
create_account!(
  first_name: 'Daniel',
  last_name: 'Song',
  email: 'supearle0518@gmail.com',
  password: '@MagicMike179',
  location: 'greenlight',
  role: 'teacher'
)

#  User.joins('join user_settings on user_settings.id = users.id').where.not(user_settings: { daily_reminder_type: 'none' }).where(user_settings: { override_location_reminders: true })

hour = 6
user_ids = UserSettings.where(
  daily_reminder_time: hour,
  remind_wed: true,
).where.not(
  daily_reminder_type: 'none',
  override_location_reminders: true
).pluck(:user_id).to_set

user_ids_from_location = Location.where(
  daily_reminder_time: hour,
  remind_wed: true,
).all.flat_map { |x| x.users_to_notify.to_a }.map(&:id)

user_ids = user_ids.merge(user_ids_from_location)

user_ids.map { |user_id| ReminderWorker.new.perform(user_id) }

Sidekiq::Cron::Job.create(name: 'Daily Reminders - every hour', cron: '0 * * * *', class: 'ScheduledReminderWorker')

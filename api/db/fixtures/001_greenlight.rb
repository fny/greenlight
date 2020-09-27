require 'faker'

Faker::Config.random = Random.new(24)

greenlight_id = Faker::Internet.uuid
mark_id = Faker::Internet.uuid
aria_id = Faker::Internet.uuid

Location.seed(:permalink, {
  id: greenlight_id,
  name: 'Greenlight Academy',
  permalink: 'greenlight-academy',
  email: 'hello@greenlightready.com',
  phone_number: '+13023160303',
  zip_code: '27701',
  category: 'school'
})

User.seed(:id, [
  {
    id: mark_id,
    first_name: 'Mark',
    last_name: 'Sendak',
    password_digest: BCrypt::Password.create('password', cost: 5),
    email: 'mark.sendak@duke.edu',
    mobile_number: '+19163006448'
  }, {
    id: aria_id,
    first_name: 'Aria',
    last_name: 'Sendak'
  }, {
    id: Faker::Internet.uuid,
    first_name: 'Faraz',
    last_name: 'Yashar',
    password_digest: BCrypt::Password.create('password', cost: 5),
    email: 'faraz.yashar@gmail.com',
    mobile_number: '+13303332729'
  }
])

LocationAccount.seed(:id, [{
  user_id: aria_id,
  role: 'student',
  location_id: greenlight_id
}])

ParentChild.seed(:parent_user_id, :child_user_id, [{
  parent_user_id: mark_id,
  child_user_id: aria_id
}])

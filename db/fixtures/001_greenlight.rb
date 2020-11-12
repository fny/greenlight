location_id_seq = Location.id_seq
user_id_seq = User.id_seq
location_account_id_seq = LocationAccount.id_seq
parent_child_id_seq = ParentChild.id_seq

location_id = location_id_seq.next()

Location.seed(:permalink, {
  id: location_id,
  name: 'Greenlight Academy',
  permalink: 'greenlight',
  email: 'hello@greenlightready.com',
  phone_number: '+13023160303',
  zip_code: '27701',
  category: 'school'
})

parents = [
  {
    first_name: 'Mark',
    last_name: 'Sendak',
    email: 'mark.sendak@duke.edu',
    mobile_number: '+19163006448',
    children: [%w[Aria Sendak]],
    is_teacher: false
  },
  {
    first_name: 'Faraz',
    last_name: 'Yashar',
    email: 'faraz.yashar@gmail.com',
    mobile_number: '+13303332729',
    children: [],
    is_teacher: true
  },
  {
    first_name: 'Daniel',
    last_name: 'Song',
    email: 'supearle0518@gmail.com',
    mobile_number: '+19167985029',
    children: [%w[Mango Banana], %w[Pineapple Banana]],
    is_teacher: true
  },  {
    first_name: 'Chiquita',
    last_name: 'Banana',
    email: 'faraz.yashar@duke.edu',
    mobile_number: '+12144448350',
    children: [%w[Mango Banana], %w[Pineapple Banana]],
    is_teacher: true
  },
  {
    first_name: 'Farhan',
    last_name: 'Banani',
    email: 'farhan@18westconsulting.com',
    mobile_number: '+19728009719',
    children: [%w[Apple Banani], %w[Banana Banani]],
    is_teacher: false
  },
  {
    first_name: 'Suresh',
    last_name: 'Balu',
    email: 'suresh.balu@gmail.com',
    mobile_number: '+19195368305',
    children: [%w[Aidan Balu]],
    is_teacher: false
  }, {
    first_name: 'Joey',
    last_name: 'Webb',
    email: 'josephbwebb@gmail.com',
    mobile_number: '+18473409377',
    children: [%w[Emmy Webb]],
    is_teacher: true
  }, {
    first_name: 'Kevin',
    last_name: "O'Keefe",
    email: 'kevin@greenlightready.com',
    mobile_number: '+17082121437',
    children: [],
    is_teacher: true
  }
]

def extract_keys(h, ks)
  extracted = {}
  ks.each do |k|
    extracted[k] = h.fetch(k)
  end
  extracted
end

users = []
location_accounts = []
parents_children = []

parents.each do |p|
  parent = extract_keys(p, [:first_name, :last_name, :email, :mobile_number])
  parent[:id] = user_id_seq.next()
  parent[:password_digest] = BCrypt::Password.create('LastMinuteTestBH', cost: 5)
  users << parent
  if p.fetch(:is_teacher)
    location_accounts << {
      user_id: parent.fetch(:id),
      location_id: location_id,
      role: 'teacher'
    }
  end

  p.fetch(:children).each do |first, last|
    child = { id: user_id_seq.next(), first_name: first, last_name: last }
    users << child
    location_accounts << {
      user_id: child.fetch(:id),
      location_id: location_id,
      role: 'student'
    }
    parents_children << {
      parent_id: parent.fetch(:id),
      child_id: child.fetch(:id)
    }
  end
end

User.seed(:id, users)
LocationAccount.seed(:id, location_accounts)
ParentChild.seed(:parent_id, :child_id, parents_children)

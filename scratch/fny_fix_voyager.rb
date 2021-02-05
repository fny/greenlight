require './elem.rb'

ELEMENTARY.each do |row|
  id, first_name, last_name, p1_first_name, p1_last_name, p1_email, p1_mobile_number, p1_email, p2_first_name, p2_last_name, p2_mobile_number, p2_email, grade, schedule, permission, role = row
  child = LocationAccount.find_by(external_id: id)&.user

  if child
    existing_p1 = if p1_mobile_number
      child.parents.where(mobile_number: p1_mobile_number)
    elsif p1_email
      child.parents.where(email: p1_email)
    end

    if (p1_mobile_number || p1_email) && existing_p1
      existing_p1.update(
        email: p1_email,
        mobile_number: p1_mobile_number,
        first_name: p1_first_name,
        last_name: p1_last_name
      )
    end

    if (p1_mobile_number || p1_email) && !existing_p1
      child.parents << User.new(
        email: p1_email,
        mobile_number: p1_mobile_number,
        first_name: p1_first_name,
        last_name: p1_last_name
      )
    end

    existing_p2 = if p2_mobile_number
      child.parents.where(mobile_number: p2_mobile_number).first
    elsif p2_email
      child.parents.where(email: p2_email).first
    end

    if (p2_mobile_number || p2_email) && existing_p2
      existing_p2.update(
        email: p2_email,
        mobile_number: p2_mobile_number,
        first_name: p2_first_name,
        last_name: p2_last_name
      )
    end

    if (p2_mobile_number || p2_email) && !existing_p2
      child.parents << User.new(
        email: p2_email,
        mobile_number: p2_mobile_number,
        first_name: p2_first_name,
        last_name: p2_last_name
      )
    end
  else # No child account
    location = Location.find_by_id_or_permalink(permalink)
    child = User.new(
      first_name: first_name,
      last_name: last_name
    )
    LocationAccount.create!(
      location: location,
      user: child,
      external_id: id,
      role: 'student',
      permission_level: 'none'
    )

    if p1_email.present? || p1_mobile_number.present?
      existing_p1 = User.find_by(mobile_number: PhoneNumber.parse(p1_mobile_number)) if p1_mobile_number
      existing_p1 ||= User.find_by(email: p1_email.downcase.strip) if p1_email

      if existing_p1
        existing_p1.update(
          email: p1_email,
          mobile_number: p1_mobile_number,
          first_name: p1_first_name,
          last_name: p1_last_name
        )
      else
        child.parents << User.new(
          email: p1_email,
          mobile_number: p1_mobile_number,
          first_name: p1_first_name,
          last_name: p1_last_name
        )
      end
    end

    if p2_email.present? || p2_mobile_number.present?
      existing_p2 = User.find_by(mobile_number: PhoneNumber.parse(p1_mobile_number)) if p1_mobile_number
      existing_p2 ||= User.find_by(email: p1_email.downcase.strip) if p1_email

      if existing_p2
        existing_p2.update(
          email: p2_email,
          mobile_number: p2_mobile_number,
          first_name: p2_first_name,
          last_name: p2_last_name
        )
      else
        child.parents << User.new(
          email: p2_email,
          mobile_number: p2_mobile_number,
          first_name: p2_first_name,
          last_name: p2_last_name
        )
      end
    end
  end
rescue => e
  puts "failure #{id} #{first_name} #{last_name} #{p1_email} #{p1_email}"
  puts e.message
  break
end; true

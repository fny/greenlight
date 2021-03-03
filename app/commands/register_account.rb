# frozen_string_literal: true
class RegisterAccount < ApplicationCommand
  ROLES = [
    STAFF = 'staff',
    TEACHER = 'teacher',
    STUDENT = 'student',
    PARENT = 'parent'
  ]
  argument :first_name
  argument :last_name
  argument :email
  argument :mobile_number
  argument :password
  argument :role
  argument :locale
  argument :location
  argument :registration_code
  argument :children

  validate :user_valid
  validate :role_valid
  validate :registration_code_valid
  validates :role, presence: true
  validates :registration_code, presence: true

  def code_for_staff?
    location.registration_code.casecmp?(registration_code&.strip)
  end

  def code_for_student?
    location.student_registration_code.casecmp?(registration_code&.strip)
  end

  def user
    return @user if defined?(@user)
    @user = User.new(
      first_name: first_name,
      last_name: last_name,
      email: email,
      mobile_number: mobile_number,
      password: password,
      locale: locale
    )

    attach_location_n_children
    @user
  end

  def work
    user.save!
    user
  end

  private

  def attach_location_n_children
    unless role == PARENT
      @user.location_accounts << LocationAccount.new(
        location: location,
        role: role
      )
    end
    if location.school? && role != STUDENT
      new_children = (children || []).map { |c|
        User.new(
          first_name: c[:first_name],
          last_name: c[:last_name],
          needs_physician: c[:needs_physician] || false,
          physician_name: c[:physician_name],
          physician_phone_number: c[:physician_phone_number],
        )
      }
      new_children.each do |child|
        child.location_accounts << LocationAccount.new(
          location: location,
          role: LocationAccount::STUDENT,
        )
      end

      @user.children += new_children
    end
  end

  def registration_code_valid
    if !code_for_staff? && !code_for_student?
      errors.add(:registration_code, :invalid)
    end
  end

  def role_valid
    # School teacher or staff
    if location.school? && code_for_staff? && [TEACHER, STAFF].exclude?(role&.strip)
      errors.add(:role, "incorrect role #{role} for school when using a staff registration code")
    end

    # School student or parent
    if location.school? && code_for_student? && [nil, '', STUDENT, PARENT].exclude?(role&.strip)
      errors.add(:role, "incorrect role #{role} for school when using a student registration code")
    end

    # Staff member at another org 
    if !location.school? && code_for_staff? && role != STAFF
      errors.add(:role, "role must be staff for locations that are not schools")
    end
  end

  def user_valid
    user.valid?
    user.errors.each do |error|
      errors.add(error.attribute, error.message)
    end
  end
end

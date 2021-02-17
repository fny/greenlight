# frozen_string_literal: true
class JoinLocation < RegisterAccount
  argument :existing_user

  def user
    return @user if defined?(@user)
    @user = existing_user

    attach_location_n_children
    @user
  end
end

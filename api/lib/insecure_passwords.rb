# frozen_string_literal: true
module InsecurePasswords
  INSECURE_PASSWORDS = Set.new(
    File.readlines(
      File.join(
        File.dirname(__FILE__),
        'data/common-passwords-over-7-characters.txt'
      )
    )
  )
end

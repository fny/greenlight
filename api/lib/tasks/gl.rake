namespace :gl do
  task :token, [:email_or_phone] => :environment do |task, args|

    user = User.find_by_email_or_mobile(args[:email_or_phone])

    if !user
      raise "No user found for #{args[:email_or_phone]}"
    end

    puts Session.new(user: user).encoded
  end
end

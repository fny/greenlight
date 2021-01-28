class ApplicationMailbox < ActionMailbox::Base
  # routing /something/i => :somewhere
  routing  :all => :survey_responses
end

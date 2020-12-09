# frozen_string_literal: true

# rubocop:disable Lint/UselessAssignment, Security/Eval
class CreatedLocationWorker < ApplicationWorker
  def perform(user_id, location_id)
    user = User.find(user_id)
    location = Location.find(location_id)
    url = "https://app.greenlightready.com/l/#{location.permalink}/code/#{location.registration_code}"
    SendGridEmail.new(
      to: user.name_with_email,
      subject: 'Greenlight: Your Location is created!',
      html: eval(html_template)
    ).run
  end

  private

  def html_template
    Erubi::Engine.new(<<~HTML).src
      <h2>Your Business has been Created</h2>
      <p>
        Your employees can now create their accounts for your business <%= location.name %> by visiting the following
        link: <a href="<%= url %>"><%= url %></a>
        <br /><br />
        They can also sign up by visiting <a href="https://app.greenlightready.com">the app</a>
        clicking create account, and signing in with the following location id
        and registration code:
        <br /><br />
        Location ID: <%= location.permalink %><br />
        Registration Code: <%= location.registration_code %>
        <br /><br />
        If you have any questions, feel free to email us at help@greenlightready.com
      </p>
    HTML
  end
end
# rubocop:enable Lint/UselessAssignment, Security/Eval

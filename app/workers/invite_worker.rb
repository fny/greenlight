# frozen_string_literal: true
class InviteWorker < ApplicationWorker
  # TODO: Make invites locations specific
  def html_template
    # TODO: Generalize
    Erubi::Engine.new(<<~HTML).src
      <h2>Welcome to Greenlight / Bienvenido a Greenlight</h2>
      <p>
        Hi <%= user.first_name %>,
      </p>
      <p>
        We're working with <%= user.affiliated_locations.map(&:name).to_sentence %> to create a safe and healthy space for learning,
        and we need your help too!
      </p>
      <p>
        Every day, you will be submitting symptoms surveys
        for <%= user.submits_surveys_for_text %> through Greenlight.
      </p>
      <p style="font-weight:bold">
        <a href="<%= user.magic_sign_in_url %>">
          Click Here to Sign In and Review Your Account
        </a>
      </p>
      <p>Thanks for your help, and let us know if you have questions.</p>
      <p>Stay safe out there,<br />
      The Greenlight Team
      </p>
      <hr />

      <p>
        Hola <%= user.first_name %>,
      </p>
      <p>
        Estamos trabajando con <%= user.affiliated_locations.map(&:name).to_sentence %> para crear un espacio seguro y saludable para el aprendizaje, y también necesitamos su ayuda.
      </p>
      <p>
        Cada día, enviará encuestas de síntomas a través de Greenlight para sus hijos o para usted mismo si es maestro o miembro del personal.
      </p>
      <p style="font-weight:bold">
        <a href="<%= user.magic_sign_in_url %>">
          Haga clic aquí para iniciar sesión y revisar su cuenta
        </a>
      </p>
      <p>Gracias por su ayuda y avísenos si tiene preguntas.</p>
      <p>Mantente a salvo,<br />
      El Equipo Greenlight
      </p>
    HTML
  end

  def sms_template
    # TODO: Generalize
    Erubi::Engine.new(<<~SMS
      <%= user.affiliated_locations.map(&:name).last %> registered you for Greenlight.
      Sign up: <%= user.magic_sign_in_url %>
    SMS
    ).src
  end

  # <Description>
  #
  # @param [Integer] user_id
  def perform(user_id)
    user = User.find(user_id)
    user.reset_magic_sign_in_token!
    I18n.with_locale(user.locale) do
      if user.email?
        SendGridEmail.new(
          to: user.name_with_email,
          subject: user.invited_at.blank? ? "✨ Welcome to Greenlight! / Bienvenido a Greenlight" : '✨ REMINDER: Welcome to Greenlight! / Bienvenido a Greenlight',
          html: eval(html_template), # rubocop:disable Security/Eval
          text: eval(sms_template), # rubocop:disable Security/Eval
        ).run
      end
      if user.mobile_number?
        PlivoSMS.new(
          to: user.mobile_number,
          from: Greenlight::PHONE_NUMBER,
          message: eval(sms_template) # rubocop:disable Security/Eval
        ).run
      end
    end

    if user.invited_at.blank?
      user.invited_at = Time.zone.now
      user.save!
    end
  end
end

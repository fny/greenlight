class InviteWorker < ApplicationWorker
  # TODO: Make invites locations specific
  def html_template
    # TODO: Generalize
    Erubi::Engine.new(<<~HTML
      <h2>Welcome to Greenlight / Bienvenido a Greenlight</h2>
      <p>
        Hi <%= user.first_name %>,
      </p>
      <p>
        We're working with W.G. Pearson Center to create a safe and healthy space for learning,
        and we need your help too!
      </p>
      <p>
        Every day, you will be submitting symptoms surveys
        for <%= user.submits_surveys_for_text %> through Greenlight.
      </p>
      <p style="font-weight:bold">
        <a href="<%= user.magic_sign_in_url(false) %>">
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
        Estamos trabajando con W.G. Pearson Center para crear un espacio seguro y saludable para el aprendizaje, y también necesitamos su ayuda.
      </p>
      <p>
        Cada día, enviará encuestas de síntomas a través de Greenlight para sus hijos o para usted mismo si es maestro o miembro del personal.
      </p>
      <p style="font-weight:bold">
        <a href="<%= user.magic_sign_in_url(false) %>">
          Haga clic aquí para iniciar sesión y revisar su cuenta
        </a>
      </p>
      <p>Gracias por su ayuda y avísenos si tiene preguntas.</p>
      <p>Mantente a salvo,<br />
      El Equipo Greenlight
      </p>
      HTML
    ).src
  end

  def sms_template
    # TODO: Generalize
    Erubi::Engine.new(<<~SMS
      <% if user.invited_at %>REMINDER! <% end %>W.G. Pearson Center has registered you for Greenlight daily monitoring.
      Sign up here: <%= user.magic_sign_in_url(false) %>
    SMS
    ).src
  end

  def perform(user_id)
    user = User.find_by!(id: user_id)
    user.reset_magic_sign_in_token!
    I18n.with_locale(user.locale) do
      if user.email?
        SendGridEmail.new(
          to: user.name_with_email,
          subject: user.invited_at.blank? ? "✨ Welcome to Greenlight! / Bienvenido a Greenlight" : '✨ REMINDER: Welcome to Greenlight! / Bienvenido a Greenlight',
          html: eval(html_template),
          text: eval(sms_template),
        ).run
      end
      if user.mobile_number?
        PlivoSMS.new(
          to: user.mobile_number,
          from: Greenlight::PHONE_NUMBER,
          message: eval(sms_template)
        ).run
      end
    end

    if user.invited_at.blank?
      user.invited_at = Time.now
      user.save!
    end
  end
end

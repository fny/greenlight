# frozen_string_literal: true
class InviteParentWorker < ApplicationWorker
  # TODO: Make invites locations specific
  def html_template
    # TODO: Generalize
    Erubi::Engine.new(<<~HTML).src
      <h2>Welcome to Greenlight / Bienvenido a Greenlight</h2>
      <p>
        Hi <%= user.first_name %>,
      </p>
      <p>
        Every day you will receive notifications to submit symptom surveys on behalf of your children:
      </p>
      
      <p>
        Login by <a href="<%= user.password_reset_url %>">resetting your password</a> or requesting a <a href="<%= user.magic_sign_in_url %>">magic sign in</a> link.
      </p>
      <p>
        You can select which days to receive notifications or disable notifications by visiting the notification page in settings.
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
        <%= user.first_name %> te ha agregado a Greenlight
        Todos los días recibirá notificaciones para enviar encuestas de síntomas en nombre de sus hijos:
      </p>
      
      <p>
      Inicie sesión <a href="<%= user.password_reset_url %>"> restableciendo su contraseña </a> o solicitando un enlace de <a href="<%= user.magic_sign_in_url %>"> inicio de sesión mágico </a>.
      </p>
      <p>
      Puede seleccionar qué días recibir notificaciones o deshabilitar las notificaciones visitando la página de notificaciones en la configuración.
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
      You have been added to Greenlight by <%= current_user.first_name %>
      Every day you will receive notifications to submit symptom surveys on behalf of your children:
      <%= user.children.map(%:first_name).to_sentence %>
      Login by <a href="<%= user.password_reset_url %>">resetting your password</a> or requesting a <a href="<%= user.magic_sign_in_url %>">magic sign in</a> link.
    SMS
    ).src
  end

  # <Description>
  #
  # @param [Integer] user_id
  def perform(user)
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

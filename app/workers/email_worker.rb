class EmailWorker < ApplicationWorker
  def perform(from, to, subject, text, html = nil)
    SendGridEmail.new(
      from: from,
      to: to,
      subject: subject,
      html: html,
      text: text,
    ).run!
  end
end

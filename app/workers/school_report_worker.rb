# frozen_string_literal: true

class SchoolReportWorker < ApplicationWorker
  def perform(user_id, location_id)
    user = User.find(user_id)
    location = Location.find(location_id)

    school_report = Reports::School.new(location)
    s3_upload = UploadToS3.new(
      content: school_report.csv,
      path: "reports/#{location.permalink}/#{Time.now.strftime('%Y-%m-%d_%H_%M')}.csv",
      filename: "report(#{location.permalink}).csv",
    )
    s3_upload.run

    if s3_upload.succeeded?
      download_url = s3_upload.result

      SendGridEmail.new(
        to: user.name_with_email,
        subject: I18n.t('emails.school_report.subject'),
        html: eval(html_template),
      ).run
    end
  end

  private

  def html_template
    Erubi::Engine.new(<<~HTML).src
      <h2><%= I18n.t('emails.school_report.title') %></h2>

      <p>
        <%= I18n.t('emails.school_report.body', school: location.name) %>
      </p>

      <p style="font-weight:bold">
        <a href="<%= download_url %>">
          <%= I18n.t('emails.school_report.action') %>
        </a>
      </p>
    HTML
  end
end

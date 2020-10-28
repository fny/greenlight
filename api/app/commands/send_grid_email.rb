# frozen_string_literal: true
class SendGridEmail < ApplicationCommand
  argument :from, default: "Greenlight <lucy@greenlightready.com>"
  argument :to
  argument :cc
  argument :bcc
  argument :subject
  argument :text
  argument :html

  validates :from, presence: true
  validates :to, presence: true
  validates :subject, presence: true


  def pony_payload
    return @pony_payload if defined?(@pony_payload)

    @pony_payload = {}
    @pony_payload[:from] = self.from
    @pony_payload[:to] = self.to
    @pony_payload[:cc] = self.cc if self.cc
    @pony_payload[:bcc] = self.bcc if self.bcc
    @pony_payload[:subject] = self.subject
    @pony_payload[:body] = self.text if self.text
    @pony_payload[:html_body] = self.html if self.html
    @pony_payload[:text_part_charset] = 'UTF-8'
    @pony_payload
  end

  def work
    Pony.mail(pony_payload)
  end
end

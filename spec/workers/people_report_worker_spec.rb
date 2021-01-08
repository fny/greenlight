# frozen_string_literal: true
require 'rails_helper'

RSpec.describe PeopleReportWorker do
  let(:dummy_download_link) { Faker::Internet.url }

  before do
    allow_any_instance_of(UploadToS3)
      .to receive(:work).and_return(dummy_download_link)
  end

  describe '#perform' do
    let(:location) { Fabricate(:location) }
    let(:admin) { Fabricate(:user) }

    before do
      Fabricate(
        :location_account,
        user: admin, 
        location: location,
        permission_level: 'admin',
      )
    end

    it 'sends an email with the report download link' do
      PeopleReportWorker.new.perform(location.id, admin.id)

      sent_mails = Mail::TestMailer.deliveries
      expect(sent_mails.size).to eq(1)

      sent_mail = sent_mails.first
      expect(sent_mail.To&.value).to eq(admin.name_with_email)
      expect(sent_mail.html_part.to_s).to include(dummy_download_link)
    end
  end
end

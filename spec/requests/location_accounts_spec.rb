# frozen_string_literal: true
require 'rails_helper'

RSpec.describe '/v1/location-accounts', type: :request do
  describe 'DELETE' do
    let(:user) { Fabricate(:user) }
    let(:location) { Fabricate(:location) }
    let(:la) { Fabricate(:location_account, user: user, location: location) }
    let(:user_other) { Fabricate(:user) }
    let(:la_other) {
      Fabricate(:location_account, user: user_other, location: location)
    }

    subject { delete_json("/v1/location-accounts/#{la.id}", user: user) }

    it "returns 401 if a user is not signed in" do
      delete_json("/v1/location-accounts/#{la.id}")

      expect(response.status).to eq(401)
      expect(response_json).to have_key(:errors)
    end

    it "returns 403 if a user doesn't own the location account" do
      delete_json("/v1/location-accounts/#{la_other.id}", user: user)

      expect(response.status).to eq(403)
    end

    it "removes the location account" do
      subject

      expect(response.status).to eq(204)
      expect(user.location_accounts.count).to be_zero
    end

    describe 'alert email' do
      let(:location_admins) {
        Fabricate.times(Faker::Number.between(from: 2, to: 4), :user)
      }

      before do
        location_admins.each do |u|
          Fabricate(
            :location_account,
            user: u,
            location: location,
            permission_level: 'admin',
          )
        end
      end

      it "sends emails to location admins" do
        subject

        expect_work(LARemovalAlertAdminsWorker)

        expect(LARemovalAlertUserWorker.jobs.size).to eq(location_admins.length)
        LARemovalAlertUserWorker.drain

        sent_mails = Mail::TestMailer.deliveries
        expect(sent_mails.size).to eq(location_admins.length)

        remaining_receivers = location_admins.map(&:name_with_email).to_set

        sent_mails.each do |sent_mail|
          expect(sent_mail[:subject].to_s).to include('Greenlight User Has Left')
          expect(sent_mail.html_part.to_s).to include(
            "#{user.full_name} has left #{location.name}"
          )

          remaining_receivers.delete sent_mail.To&.value
        end

        expect(remaining_receivers).to be_empty
      end
    end
  end
end

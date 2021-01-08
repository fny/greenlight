# frozen_literal_string: true
require 'rails_helper'

RSpec.describe '/v1/locations', type: :request do
  let(:location) { Fabricate(:location) }
  let(:admin) { Fabricate(:user) }

  before do
    # skip actual uploading to S3 bucket, stub the operation
    allow_any_instance_of(UploadToS3)
      .to receive(:work).and_return(Faker::Internet.url)
  end

  describe 'POST :location_id/people-report' do
    subject { post_json("/v1/locations/#{location.id}/people-report", user: admin) }
  
    it "returns 403 if a user isn't the admin of the location" do
      subject

      expect(response.status).to eq(403)
    end

    context 'when requested by the location admin' do
      before do
        Fabricate(
          :location_account,
          user: admin, 
          location: location,
          permission_level: 'admin',
        )
      end

      it "generates report and sends download link" do
        subject

        expect_success_response
        expect_work(PeopleReportWorker)
      end
    end
  end
end

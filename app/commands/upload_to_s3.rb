# frozen_literal_string: true
class UploadToS3 < ApplicationCommand
  attribute :csv

  def work
    obj = AMAZON_S3_CLIENT.bucket(s3_bucket).object("#{Time.now}/report.csv")
    obj.put(body: csv, acl: 'public-read', content_disposition: 'attachment')

    return obj.public_url
  rescue => e
    puts e.inspect
  end

  def s3_bucket
    if Rails.env == 'development'
      'glit-dev'
    else
      'glit-prod'
    end
  end
end

# frozen_literal_string: true
class UploadToS3 < ApplicationCommand
  attribute :content
  attribute :path
  attribute :filename
  attribute :expires_in, default: 3600

  validates :content, presence: true
  validates :path, presence: true
  validates :filename, presence: true

  def work
    s3 = Aws::S3::Resource.new(
      region: ENV['AWS_REGION'],
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
    )

    bucket = s3.bucket(ENV['AWS_BUCKET'])
    obj = bucket.object(self.path)
    obj.put(body: self.content, content_disposition: "attachment; filename=#{self.filename}")

    obj.presigned_url(:get, expires_in: self.expires_in)
  rescue => e
    puts e.inspect
  end
end

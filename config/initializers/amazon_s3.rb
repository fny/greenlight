AMAZON_S3_CLIENT = Aws::S3::Resource.new(
  region: 'us-east-1',
  access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
)

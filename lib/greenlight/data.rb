# frozen_string_literal: true
module Greenlight
  module Data
    def fetch_gdrive(id, extension, name = nil)
      response = Faraday.new(url: "https://drive.google.com/uc?export=download&id=#{id}") { |f|
        f.use FaradayMiddleware::FollowRedirects
      }.get
      file = Tempfile.new([name || id, ".#{extension}"], binmode: true)
      file.write(response.body)
      file.close

      if response.body.include?('<!DOCTYPE html>')
        raise("Received HTML in the response from Google")
      end

      file.path
    end

    def read_file(file)
      File.read(self.file_path(file))
    end

    def load_yaml(file)
      YAML.load(self.read_file(file))
    end

    def load_json(file)
      JSON.parse(self.read_file(file))
    end

    def file_path(file)
      Rails.root.join('data', file)
    end
    module_function :file_path, :read_file, :load_yaml, :load_json, :fetch_gdrive

    # INSECURE_PASSWORDS = Set.new(self.readlines('common-passwords-over-7-characters.txt'))
    MOBILE_CARRIERS = self.load_yaml('mobile_carriers.yml')
  end
end

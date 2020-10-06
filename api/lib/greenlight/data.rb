module Greenlight
  module Data
    def read_file(file)
      File.read(self.file_path(file))
    end

    def load_yaml(file)
      YAML.load(self.read_file(file))
    end

    def file_path(file)
      File.join(File.dirname(__FILE__), "data/#{file}")
    end
    module_function :file_path, :read_file, :load_yaml

    # INSECURE_PASSWORDS = Set.new(self.readlines('common-passwords-over-7-characters.txt'))
    MOBILE_CARRIERS = self.load_yaml('mobile_carriers.yml')
  end
end

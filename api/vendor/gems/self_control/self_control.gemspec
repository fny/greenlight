require_relative 'lib/self_control/version'

Gem::Specification.new do |spec|
  spec.name          = 'self_control'
  spec.version       = SelfControl::VERSION
  spec.authors       = ['Faraz Yashar']
  spec.email         = ['faraz.yashar@gmail.com']

  spec.summary       = "Control flow with an audit trail."
  spec.description   = "Control flow with an audit trail. Track your ifs and elses."
  spec.homepage      = 'https://github.com/fny/self_control'
  spec.license       = 'MIT'
  spec.required_ruby_version = Gem::Requirement.new('>= 2.3.0')

  spec.metadata['homepage_uri'] = spec.homepage
  spec.metadata['source_code_uri'] = spec.homepage
  spec.metadata['changelog_uri'] = 'https://github.com/fny/xorcist/blob/master/CHANGELOG.md'

  # Specify which files should be added to the gem when it is released.
  # The `git ls-files -z` loads the files in the RubyGem that have been added into git.
  spec.files         = Dir.chdir(File.expand_path('..', __FILE__)) do
    `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  end
  spec.bindir        = 'exe'
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ['lib']
  spec.add_development_dependency 'solargraph'
end

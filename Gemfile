source 'https://rubygems.org'

ruby File.read('.tool-versions').match(/ruby (.*)/)[1].strip

#
# Core
#

# Use postgresql as the database for Active Record
gem 'pg', '>= 0.18', '< 2.0'
# Use Puma as the app server
gem 'puma', '~> 4.1'
# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 6.0.3', '>= 6.0.3.2'
# Simple, efficient background processing for Ruby
gem 'sidekiq', '< 7'
# Enables to set jobs to be run in specified time
gem 'sidekiq-cron', '1.2'

#
# Engines and Middlewares
#

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
gem 'rack-cors'
gem 'rack_csrf'
gem 'rack-freeze'

#
# Performance
#

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false
# C implementation of Active Support's String#blank?
gem 'fast_blank', platform: :mri
# C extensions for escaping text
gem 'fast_xs', platform: :mri
# Generic swappable back-end for JSON
gem 'multi_json'
# Optimized JSON
gem 'oj', platform: :mri
# Blazing-fast-cross-platform-monkey-patch-free string XOR
gem 'xorcist'

#
# Misc
#

# What ActiveModel left out
gem 'active_attr'
# Password encryption
gem 'bcrypt', '~> 3.1.7'
# Streaming Spreadsheets
gem 'creek'
# Enumerated attributes
gem 'enumerize'
# Exception notifier
gem 'exception_notification'
# Library for generating fake data
gem 'faker'
# Simple, but flexible HTTP client library
gem 'faraday'
# A lightning fast JSON:API serializer for Ruby Objects.
gem 'fast_jsonapi'
# Implementation of Jaro-Winkler string similary
gem 'jaro_winkler'
# JSON web tokens
gem 'jwt'
# Tame Rails' default policy to log everything
gem 'lograge'
# ActiveSupport::Memoizable with a few enhancements
gem 'memoist'
# A minimal, fast, safe sql executor
gem 'mini_sql'
# Phone validations
gem 'phonelib'
# SMS API and Voice API platform
gem 'plivo'
# The express way to send email
gem 'pony'
# Rails Locale Data Repository
gem 'rails-i18n', '~> 6.0.0'
# Advanced seed data handling for Rails
gem 'seed-fu', '~> 2.3'
# Control flow tracing.
gem 'self_control', path: 'vendor/gems/self_control'
# Twilio Sendgrid Email API
gem 'sendgrid-ruby'
# Automatically strips all attributes of leading and trailing
gem 'strip_attributes'
# Performance monitoring
gem 'skylight'
# TablePrint shows objects in nicely formatted columns
gem 'table_print', require: false
# Email validations
gem 'valid_email2'
# AWS S3
gem 'aws-sdk-s3'

group :development, :test do
  # Annotate Rails classes with schema and routes info
  gem 'annotate'
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  # Load environment variables from `.env`
  gem 'dotenv-rails'
  # Object generation framework
  gem 'fabrication'
  # 2x Testing Speed
  gem 'parallel_tests'
  # `rails c` alternative and runtime developer console
  gem 'pry-rails'
  # Launch a pry session when a test fails
  gem 'pry-rescue'
  # Move up and down the stack with pry
  gem 'pry-stack_explorer'
  # Behavior driven development in Ruby
  gem 'rspec'
  gem 'rspec-rails'
  # Swagger-based DSL for RSpec
  gem 'rswag-specs'
  # Ruby static code analyzer
  gem 'rubocop', require: false
  gem 'rubocop-performance', require: false
  gem 'rubocop-rails', require: false
  gem 'rubocop-rspec', require: false

  # Test one-liners for common Rails functionality
  gem 'shoulda-matchers'
end

group :development do
  # Improve Rails error pages
  gem 'better_errors'
  # Used by better errors
  gem 'binding_of_caller'
  # Help to kill N+1 queries and unused eager loading
  gem 'bullet', '~> 6.1.0'
  # Manage Procfile-based apps
  gem 'foreman', require: false
  # Listens for file modifications, used by Spring
  gem 'listen', '~> 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  # A Ruby language server
  gem 'solargraph', require: false
end

group :test do
  # Simple testing of Sidekiq jobs
  gem 'rspec-sidekiq'
end

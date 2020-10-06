# SelfControl 🎛

Control flow with an audit trail for conditional statements. Track your ifs and elses to make debugging gnarly conditionals a breeze.

## About

SelfControl was sponsored [Greenlight](https://greenlightready.com) COVID-19 monitoring to 
debug deeply nested logic used to determine whether students and teachers are fit to return to school.

Learn more about how [Greenlight can help your schools can keep the coronavirus at bay](https://greenlighted.org). Interested in working for Greenlight? Email faraz {at} greenlightready {dot} com.

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'self_control'
```

And then execute:

    $ bundle install

Or install it yourself as:

    $ gem install self_control

## Usage

I'm an extremely complicated person. Figuring out when I want to ice cream is hard.

```ruby
require 'self_control'

def sunny?; false; end

def having_cravings?; false; end

def not_in_debt?; false; end

temperature = 99
income = 10

flow = SelfControl::Flow.new(self) do
  If('temperature > 97') {
    Return(:yes)
  }.Elsif(And(:sunny?, 'income > 2')) {
    Return(:yes)
  }.Else {
    If(:having_cravings?) {
      Return(:yes)
    }
    If(Not(temperature > 30)) {
      Return(:no)
    }
  }
  Return(:no)
end

flow.result # => :no
flow.trace.to_s # => TODO

```

Within the specified target (in this case `self`):

 - Strings are evaled
 - Symbols are sent

You can also execute statements directly inside a branch, but you won't be able to see what was evaluated in the trace.

TODO: List logical functions available

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake test` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

To type check run:

```
solargraph typecheck
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/fny/self_control.

## Wishlist

 - Case statements
 - Unless support
 - Add boolean operators for conditions

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

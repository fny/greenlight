module Sinatrify
  extend ::ActiveSupport::Concern

  included do
    class_attribute :sinatrify_router
    self.sinatrify_router = ActionDispatch::Routing::RouteSet.new
  end

  module ClassMethods
    def call(env)
      sinatrify_router.call(env)
    end

    def mapper
      @mapper ||= ActionDispatch::Routing::Mapper.new(sinatrify_router)
    end

    %w[get post put delete patch].each do |verb|
      class_eval <<-RUBY, __FILE__, __LINE__ + 1
        def #{verb}(path, options = { auth: true }, &block)
          define_action("#{verb}", path, options) do
            ensure_authenticated! if options[:auth]
            instance_eval(&block)
          end
        end
      RUBY
    end

    private

    # See https://api.rubyonrails.org/v6.0.3.3/classes/ActionDispatch/Routing/Mapper/Base.html
    # for possible options.
    def define_action(verb, path, options, &block)
      action_name = "#{verb}#{path.tr('/', '_')}"
      define_method(action_name, block)
      options[:via] = verb
      options[:to] = action(action_name)
      mapper.send(verb, path, options)
    end
  end
end

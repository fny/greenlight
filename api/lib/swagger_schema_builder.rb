# frozen_string_literal: true
class SwaggerSchemaBuilder
  attr_reader :schema

  def self.build(&block)
    schema = new
    schema.instance_eval(&block)
    schema.schema
  end

  def initialize
    @wrapped = wrapped
    @schema = {
      type: :object,
      properties: {}
    }
  end

  def respond_to_missing?
    true
  end

  def method_missing(method, *args, &block)
    if args.any?
      @schema[:properties][method] = { type: args[0] }
      @schema[:properties][method].merge!(args[1..].reduce({}, :merge))
    end
    if block_given?
      @schema[:properties][method] = SwaggerSchemaBuilder.build(&block)
    end
  end
end

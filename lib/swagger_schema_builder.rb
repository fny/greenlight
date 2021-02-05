# frozen_string_literal: true
class SwaggerSchemaBuilder
  InvalidSwaggerTypeError = Class.new(StandardError)
  TYPES = %i[string number integer boolean array object].freeze

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

  def has_one(relationship, type)
    @schema[:properties][:relationships] ||= {}
    @schema[:properties][:relationships][relationship] = {
      type: :object,
      nullable: true,
      default: :null,
      properties: {
        id: { type: :string },
        enum: [type]
      }
    }
  end

  def has_many(relationship, type)
    @schema[:properties][:relationships] ||= {}
    @schema[:properties][:relationships][relationship] = {
      type: :array,
      nullable: false,
      items: {
        type: :object,
        nullable: false,
        properties: {
          id: { type: :string },
          type: {
            type: :string,
            enum: [type]
          }
        }
      }
    }
  end

  def included(other_schema)
    @schema[:properties][:included] ||= {
      type: :array,
      nullable: false,
      items: {
        anyOf: []
      }
    }
    @schema[:properties][:included][:items][:anyOf] << other_schema[:properties][:data]
  end

  def method_missing(method, *args, **options, &block)
    if args.any?
      raise(InvalidSwaggerTypeError, "Not sure how to handle method #{method} type #{args[0]}") if TYPES.exclude?(args[0])

      @schema[:properties][method] = { type: args[0] }
      @schema[:properties][method].merge!(args[1..].reduce({}, :merge))
    end

    if block_given?
      @schema[:properties][method] = SwaggerSchemaBuilder.build(&block)
    end

    if options[:enum]
      @schema[:properties][method][:enum] = options[:enum]
    end

    unless options[:nullable].nil?
      @schema[:properties][method][:nullable] = options[:nullable]
    end

    if options[:required]
      @schema[:required] ||= []
      @schema[:required] << method.to_s
    end
  end
end

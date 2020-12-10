# frozen_string_literal: true
module Commands
  # Base class that all commands inherit from
  class Base
    include ActiveAttr::Model

    STATES = [
      # The command has not been run yet.
      :not_run,

      # The command completed successfully.
      :succeeded,

      # A failure occured raised when runnning the command (e.g. missing parameter)
      :failed,

      # An exception was raised when runnning the command
      :errored
    ]

    # The result of #work
    attr_reader :result

    def self.title
      @title
    end

    def self.title=(title)
      @title = title
    end

    # Used by commands to set a description for the command
    def self.description=(description)
      @description = description
    end

    # Returns the description of the command that's been set
    def self.description
      @description
    end

    # Returns a list of a commands arguments
    def self.arguments
      @arguments ||= []
    end

    # Define a command argument
    #
    # name - the String name of the command
    # options:
    #   label - the String label to put on the form field
    #   description - the description to append to the form field
    #   type - the symbol of the field type, see ACTIVE_ATTR_TYPECASTING
    #   default - the default value of the form field
    def self.argument(name, label: nil, description: nil, type: :object, default: nil)
      argument = Argument.new(
        name: name,
        label: label || name.to_s.titleize,
        description: description,
        type: type,
        value: default
      )
      arguments << argument
      # Define the ActiveAttr attribute
      attribute name, type: argument.active_attr_type, default: default
    end

    # Returns a list of arguments for the command
    def arguments
      self.class.arguments
    end

    # Raised by methods that require the command to have been run
    CommandNotRun = Class.new(StandardError)
    CommandAborted = Class.new(StandardError)
    CommandFailed = Class.new(StandardError)
    # Implement me in your child classes!
    #
    # Your method should returns a Boolean: true if the work was successful and false if it wasn't
    def work
      raise NotImplementedError
    end

    # Wrapper for work that manages the state of whether the command has run and
    # whether the command was successful.
    #
    # Returns the Boolean whether the command was successful.
    def run
      return @succeeded if defined?(@succeeded)
      if valid?
        @result = work
        @succeeded = true
      else
        @succeeded = false
      end
    rescue CommandAborted
      Rails.logger.debug("Aborted command! #{self.errors.details}") if Rails.env.development?
      @succeeded = false
    end

    def run!
      return true if run
      raise CommandFailed
    end

    # Call this to force a failure during `#work`
    # Takes either one or two args.
    # If there one arg, that error is added to the base
    # If there are two args, the attribute is the first item, the error is the
    # second.
    def fail!(*args)
      if args.length == 1
        errors.add(:base, args[0])
      elsif args.length == 2
        errors.add(args[0], args[1])
      else
        raise ArgumentError.new("Too many arguments given (#{args.length}): #{args}")
      end
      raise CommandAborted
    end

    # Did something go wrong when running this command?
    def errored?
      @error.present?
    end

    # Returns the error string built during processing in `#run`
    def error
      @error
    end

    # Returns the Boolean whether the command completed successfully.
    # Raises CommandNotRun if the command has not been run yet.
    def succeeded?
      if run?
        @succeeded
      else
        raise CommandNotRun
      end
    end

    # Returns the Boolean whether the command failed.
    # Raises CommandNotRun if the command has not been run yet.
    def failed?
      !succeeded?
    end

    # Returns whether the command has run.
    def run?
      defined?(@succeeded)
    end

    # List of recorded result messages, add things to this with `log_result`
    # from inside a command class
    def messages
      @results ||= []
    end

    private

    # Log any strings as a result within a command using this method
    def add_message(*args)
      messages << args.join(' ')
    end

    class Argument < OpenStruct
      ACTIVE_ATTR_TYPE_MAP = {
        decimal: BigDecimal,
        boolean: ActiveAttr::Typecasting::Boolean,
        date: Date,
        datetime: DateTime,
        float: Float,
        object: Object,
        string: String
      }.freeze

      # Returns the ActiveAttr type for the provided SimpleForm type
      def active_attr_type
        ACTIVE_ATTR_TYPE_MAP.fetch(type)
      end

    end
  end
end

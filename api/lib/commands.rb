module Commands
  # Base class that all commands inherit from
  class Base
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

    include ActiveAttr::Model

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
    def self.argument(name, label: nil, description: nil, type: :string, default: nil)
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
      return @succeeded if @has_run
      @has_run = true

      if !valid?
        @succeeded = false
        return false
      end
      @succeeded = true
      @result = work
    rescue CommandAborted
      Rails.logger.debug("Aborted") if Rails.env.development?
      @succeeded = false
      nil
    rescue => error
      
      @error = "#{error.class}: #{error.message}"
      @error << "\n\n"
      @error << error.backtrace.join("\n")
      Rails.logger.error("Error in Command: #{@error}")
      nil
    end

    # Call this to force a failure during `#work`
    def fail!(*args)
      if args.length == 1 
        errors.add(:base, message: args[0])
      elsif args.length == 2
        errors.add(args[0], message: args[1])
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
      @has_run ||= false
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
      ACTIVE_ATTR_TYPECASTING = {
        boolean: ActiveAttr::Typecasting::Boolean,
        string: String,
        file: Object,
        text: String
      }

      # Returns the ActiveAttr type for the provided SimpleForm type
      def active_attr_type
        ACTIVE_ATTR_TYPECASTING[type] || String
      end

    end
  end
end

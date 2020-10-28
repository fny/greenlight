namespace :gl do
  desc "Prints complete list of middleware based on config.ru"
  task :middleware do
    require 'rack'
    require 'pp'

    def class_name(app)
      app.class.to_s == 'Class' ? app.to_s : app.class.to_s
    end

    def middleware_classes(app)
      apps = []
      loop do
        if app.instance_variable_get(:@mapping)
          apps << {
            class_name(app) => app.instance_variable_get(:@mapping).map { |m| middleware_classes(m[3]) }
          }
          break
        end
        apps << class_name(app)
        app = app.instance_variable_get(:@app)
        break if app.nil?
      end
      apps
    end

    app = Rack::Builder.parse_file('config.ru').first
    pp middleware_classes(app)

  end
end

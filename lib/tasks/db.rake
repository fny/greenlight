namespace :db do
  task :nuke do
    %w[db:drop db:create db:migrate].each do |task|
      Rake::Task[task].invoke
      Sidekiq.redis { |r| puts r.flushdb }
    end
  end
end

namespace :db do
  task :nuke do
    %w[db:drop db:create db:migrate db:seed].each do |task|
      Rake::Task[task].invoke
    end
  end
end

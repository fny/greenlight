web: bin/rails server -p $PORT -e $RAILS_ENV
worker: bundle exec sidekiq -c 2
release: bin/rake db:migrate

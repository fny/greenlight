# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## TODO

On Error, return the proper errors object

Handle ERR_CONNECTION_REFUSED


curl -g "https://api.honeybadger.io/v1/deploys? \
  deploy[environment]=production& \
  deploy[local_username]=Faraz Yashar& \
  deploy[repository]=git@github.com:user/repo.git& \
  deploy[revision]=b6826b8& \
  api_key=1a49717c"

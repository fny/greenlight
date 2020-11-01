# Changelog

This is a first attempt to [keep a changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

 - Added tests for GreenlighStatus submission date conflicts
 - Impoved documentation for GreenlightStatusScenario
 - Added ability to build and deploy entire app to Heroku when `SERVE_BUILD` is
   true
 - Added Rubocop and ESLint
 - Combined all directories into one master director to simplify deploys
 - Added fixes to protect against XSS and CSRF attacks
 - Dropped universal login feature
 - Added environment based password to Sidekiq UI
 - Added authorization checks for data editing
 - Added MiniSQL to allow for queries that side step ActiveRecord
 - Got the tests working
 - Add the start of swagger docs for the API

## [0.0.1] - 2020-10-22

Deployed 16649714. Let's just assume that this is the dawn of time for the app.
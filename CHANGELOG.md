# Changelog

This is a first attempt to [keep a changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

 - Fixed ability to delete users who had made locations
 - Added LocationAccount#parents
 - TODO: password resets
 - TODO: Smoke tests
 - TODO: roster imports
 - Upgrade to Rails 6
 - Token based authentication for Cordova
 - Add simply query methods across all models (`Model#q`)
 - Added methods to easily users with a certain role by location (Backend)
 - Added backend administrative pages
 - Added support for phone numbers from other North American countries (+1 prefix) (Backend)
 - Improve sign in error messages
 - Add invitation lookup mechansim
 - Add notice to jdenticon to show that somone has registered

## [1.4.0] - 2020-12-1

 - We can now register staff and students through a roster upload
 - Users can now request an invite from a location's page

## [1.3.1] - 2020-11-25

 - Fix Spanish
 - Fix iframe wrapping and sizing
 - Fix bug where user's children were fixed
 - Allow admins to create other admins
 - Fix typos and rendering issues
 - Add home link to navigation

## [1.2.0] - 2020-11-20

 - Add buggy business registration
 - Remove Spanish temporarily

## [1.1.0] - 2020-11-6

 - Fix submited_for_today? bug that was plaguing Sidekiq
 - Add release card
 - Add support page
 - Add schedule test page
 - Attempt to fix exception notification
 - Improve translations
 - Add student report
 - Add additional scopes and realtions for accessing parents and students
 - Fix admin check in mobile app
 - Add error message for unsupported browsers
 - Add online status component
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

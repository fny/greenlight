# Changelog

This is a first attempt to [keep a changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]
## [1.7.3] - 2020-02-09

 - Note this changelog includes updates from after v1.5.0
 - Add location statistics for superusers
 - Add mental health resources
 - Fixed password reset length error
 - Added no symptoms button
 - Merge greenlight status editing feature
 - Fix UJS issues in the backend
 - Fix multiple clicks in app
 - Update quarantine guidance
 - Phone number issue resolutions
 - Add new registration flow
 - Update design to new branding

## [1.5.0] - 2020-01-11

- Password resets have been fully integrated
- WIP: Pagination for large schools
- Add new custom translation component Tr
- Disabled more annoying things in Rubocop
- Add .dedupe method to ActiveRecord models
- Add .pluck_to_hash to ActiveRecord models
- Improve roster imports to allow for backend admins to make changes
- Add backend pages to easily make changes to application data
- WIP: Attempt to add progress bar for registration
- WIP: Self registration and emails (still needs work)
- Add preloading for iframes
- Improve loading time on all resource pages
- Add positive case page
- Add administrative dashboard

## [1.4.0] - 2020-12-01

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

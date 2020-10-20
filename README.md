# Greenlight 🚦

This is the README for the overall project.

You'll need to also start the API (see `./api/README.md`) and the client app `./app`.

The admin application is a work in progress.

## Directory Structure

 - `/api` Greenlight API. Runs on port 9990.
 - `/app` Mobile web application. Runs on port 9991.
 - `/admin` Admin dashboard. Needs work. Runs on port 9992.
 - `/commonjs` This is where code between the mobile app and the admin application lives.
 - `/scripts` This is where useful scripts go.

## Run the project

 - cd app && npm start
 - cd api && bin/rails s
 - cd api && bundle exec sidekiq

## Coding Conventions

 - [Editorconfig Plugin](https://editorconfig.org/#download) should be installed in your editor
 - Follow [Conventional Commits](https://conventionalcommits.org)
 - Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0)
 - Follow style guides specific to the directories

## Development Requirements

For the top level of this project, you'll need the following:

 - Bash and Ruby v2.7.1 to run some of scripts
 - Optionally, if you want to access the app from `app-dev.greenlightready.com` and `api-dev.greenlightready.com` you can install NGINX and use the configuration in `nginx-development.conf`.
 - See `/api`, `/app`, and `/admin` for more specific installation requirements.


Note this directory structure is bound to change, especially during early stages.

## Short URLs

We have a short URL that is used to help access the app using text messages.
It's available across all of the environments:

 - glit.me/* redirects to app.greenlightready.com/*
 - dev.glit.me/* redirects to app-dev.greenlightready.com/*
 - staging.glit.me/* redirects to app-staging.greenlightready.com/*

This variable is set using the SHORT_URL environment variable.

## README TODOs

 - Explain deployment and staging
 - Clean up notes below

---

This is Faraz's brain dump. Please ignore for now.

## Naming conventions

### React

#### Resources

Say you want to add a posts concept to your app. Users should be able to perform CRUD operations. How should you structure your routes and pages?

For each action, you should add helpers to generate routes which map to pages as follows:

 - `postsPath => '/posts' => PostsPage`: View all posts
 - `postsNewPath => '/posts/new' => PostsNewPage`:  Create a new post
 - `postsDeletePath => '/posts/delete' => PostsDeletePage`: Perform delete on a collection of posts
 - `postsActionPath => '/posts/action' => PostsActionPage`: Perform an action on a collection of posts
 - `postPath => '/posts/:id' => PostPage`: View a post
 - `postEditPath => '/posts/:id/edit' => PostEditPage(id)`: Edit a post
 - `postDeletePath => '/posts/:id/delete' => PostDeletePage(id)`: Delete a post
 - `postActionPath => '/posts/:id/action' => PostActionPage(id)`: Perform an action on a post

Note this is very similar to how Rails does routing, however, we deliberately but the action after the resource for sorting.

All components corresponsing to pages should be in the `./pages/` directory or nested by resource (e.g. `./pages/posts/`)

Nested resources follow the same convention above:

 - `userPostsPath => 'users/:userId/posts' => UsersPostsPage(userId)`: View all posts for this user
 - `userPostPath => 'users/:userId/posts/:id' => UserPostsPage(userId, id)`: View a post by this user

Again components corresponsing to pages should be in the `./pages` directory. If you want to create a separate folder, follow the same pattern as before but do not nest (e.g. `./pages/usersPosts/`).

#### Shared Components

React components that are shared across pages in a single app go in the `./components` directory.

## Notes

### Covid Pathways

 - If nothing in survey is checked, proceed to school
 - If exposure only, stay home for 14 days
 - If diagnosed asymptomatic home for 10 days
 - If one symptom,
  - If positive or not tested:
    - 10 days since first symptoms
    - No fever for 24 hours (without fever reducing techniques)
    - Symptom improviment
  - Negative test
    - No fever for 24 hours
  - Confirmed alternative diagnosis

#### COLORS

LIGHT GREEN #33DA97

GREEN #00A183

DARK GREEN #0A322B

YELLOW #FFD034

PINK #FF3494

LIGHT GOLD #FFFAA1

GOLD #FFCD65

### UI Todo

#### User Settings

Your Information
Your Children
Add a Guardian
Approved Locations
Reminders and Notifications
Terms and Conditions
Software Licenses

TODO: Remove tests from app build
LINGUI FOR I18N


Conversation with Restaurants

 - What do you do when one worker gets sick and everyone in a place has been exposed?
 - What is the time frame for results?
 - Schedule the test within 24 hours, get a result in 24 hours
 - What are the different protocols?
 - How are employees paid if they get COVID?
 - What do tests cost?
 - Data security? Permanently delete data. No analytics.

TODOs:

 - Send out reminders in the AM
 - Hide password digest from logs
 - Drop birth date
 - Add created by as Lucy
 - Add approved by user at for current users
 - Add approved by location at to import
 - Add SMS and email confirmation
 - Add selecting mobile numbers
 - Add auth token set at
 - Add magic sign in expiration
 - Add reminders
 - Fix exception notification
 - Add titles to staff
 - Add more giphy images
 - Hide magic sign in URLs from honeybadger
 - Clean up repo of all hardcoded password and configurations
 - Destroy git history
 - Fix search in app
 - Prep for new businesses


Faraz needs to organize the followi

## Tags

 - TODO: Things that need to be done
 - FIXME: Things that really need to be fixed
 - HACK: A quick and dirty thing that needs to be done better

## TODO

On Error, return the proper errors object

Handle ERR_CONNECTION_REFUSED


curl -g "https://api.honeybadger.io/v1/deploys? \
  deploy[environment]=production& \
  deploy[local_username]=Faraz Yashar& \
  deploy[repository]=git@github.com:user/repo.git& \
  deploy[revision]=b6826b8& \
  api_key=1a49717c"


## Yason API

We'll be using this for version 2 of the API.

Goals:

 - Hypermedia sanity
 - Add more flexibility than JSON API
 - Add actions
 - Allow for bulk operations
 - Allow for remote/client sync
 - Allow for conflict resolution
 - Smaller payloads


### "Primitive" Types

 - Boolean:
 - Password:
 - Symbol:
 - String:
 - Integer:
 - BigInt:
 - Int64:
 - Int32:
 - Float:
 - Double:
 - Date:
 - DateTime:
 - Enum:
 - Array:

### Actions

Based on HTTP verbs:

POST /resource => createResource
Creates a resource and updates the locale store

GET /resource => readResource
Fetches a resource and updates the local store

PATCH /resource => updateResource
Updates a resource and updates the local store

DELETE /resource => deleteResource
Performs a soft delete of the resource at first and queues a delete to occur far into the future giving clients time to delete data

Writer actions:

POST /records/action
POST /records/:id/action

Reader actions:

GET /records/action


It should be well known if an endpoint retuns a single value or not


### Camel Casing


### Errors

### Pagination Meta

### Extensions

# Greenlight 🚦

This is the README for the overall project.

## Requirements

- Ruby and Node, see `.tool-versions` for the specific verions
- Postgres v12
- Redis v6
- NGINX if you want to dev while using the api-dev loopback address;
  you'll need to use the configuration in `nginx-development.conf`.
- See `/client` for frontend specific requirements
- See `/cordova` for iOs and Android specific requirements

## Setting up the project

After you've installed the above and, run the following:

```
bundle install
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake db:seed
```

## Running the project

- `cd frontend && npm start` to start the frontend
- `bin/rails s` to start the API server
- `bundle exec sidekiq` to start the worker
- `bundle exec rspec` to run the API test suite

## Run Cordova

- `npm run cordova-init` to install cordova platform and plugins
- `npm run run-cordova-ios` or `npm run run-cordova-android` to run the mobile app

## Coding Conventions

- Follow [Conventional Commits](https://conventionalcommits.org)
- Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0)
- Try to stay within 80 characters per line. It's okay if you go to 100. You'll
  get yelled at if you exceed 120.
- Follow style guides specific to the directories
- When in doubt, try to match what you see
- Use plugins for your editor (see Editor Setup) to conform to the style guides
- For Ruby, use YARD to document your types. This makes Solargraph's
  autocomplete smarter and will prepare us for the data when Ruby supports
  type checking natively.

## Editor Setup

We don't really care what editor you use for as long as you follow the coding
convetions imposed by Rubocop and eslint.

You should try to have the following plugins in whatever editor you choose to use:

- [Editorconfig Plugin](https://editorconfig.org/#download) should be installed
  in your editor
- A TypeScript plugin
- A plugin which supports ESLint issues and aucorrection
- A Ruby language server plugin
- A Solargraph plugin for type hints in Ruby
- A Rubocop plugin

Visual Studio Code is recommended with the following plugins:

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [endwise](https://marketplace.visualstudio.com/items?itemName=kaiwood.endwise)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Rewrap](https://marketplace.visualstudio.com/items?itemName=stkb.rewrap)
- [Ruby](https://marketplace.visualstudio.com/items?itemName=rebornix.Ruby)
- [Ruby Solargraph](https://marketplace.visualstudio.com/items?itemName=castwide.solargraph)
- [Sync Scroll](https://marketplace.visualstudio.com/items?itemName=dqisme.sync-scroll) for language files
- [YARD Documentor](https://marketplace.visualstudio.com/items?itemName=pavlitsky.yard) press Ctrl+Alt+Enter (Option+Command+Enter on macOS) or invoke Document with YARD from the command palette.

If you're coming from Sublime, [this extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings) might come in handy.

If you're using VSCode, you should use the workspace specific configurations
provided in this repo.

---

This is Faraz's brain dump. Please ignore for now.

## Short URLs

We have a short URL that is used to help access the app using text messages.
It's available across all of the environments:

- glit.me/_ redirects to app.greenlightready.com/_
- dev.glit.me/_ redirects to app-dev.greenlightready.com/_
- staging.glit.me/_ redirects to app-staging.greenlightready.com/_

This variable is set using the SHORT_URL environment variable.

## Naming conventions

### React

#### Resources

Say you want to add a posts concept to your app. Users should be able to perform CRUD operations. How should you structure your routes and pages?

For each action, you should add helpers to generate routes which map to pages as follows:

- `postsPath => '/posts' => PostsPage`: View all posts
- `postsNewPath => '/posts/new' => PostsNewPage`: Create a new post
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


### Wishlist

 - Override current status
 - Fix the spanish
 - Be able to submit a test result
 - Fix greenlightdurham.com to link to app
 - Pass page for all children
 - Be able to idenify owners
 - Easy approval form
 - Owners are admins
 - Be able to add, remove, and list locations
 - Forgot password views
 - Ask for number of employees if > 70, show contact us message
 - Add form for requests
 - Change COVID relief payments to financial assistance
 - Add TOS for business customers
 - Simplify TOS
 - Add privacy policy page

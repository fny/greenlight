# Greenlight 🚦

Open source symptom monitoring software for COVID-19.
## Primary Authors

 - Daniel Song (https://github.com/ever-dev)
 - Jeremy Wong (https://github.com/jeremy-he-codes)
 - Faraz Yashar (https://github.com/fny)

Special thanks to all of our contributors 🍻
## Requirements

- A 'Nix based operating system: unforunately, Ruby still makes Windows cry
- Ruby and Node, see `.tool-versions` for the specific versions
- Postgres v12
- Redis v6
- See `/client` for frontend specific requirements
- See `/cordova` for iOS and Android specific requirements

## Backend Set Up

### Dependencies

For Ruby and Node, we recommend using a manager like `rvm`, `rbenv`, `nvm`. I prefer to
use [asdf](https://asdf-vm.com) since it covers both and will respond to version changes
in `.tool-versions`=. If

For Postgres and Redis, we recommend you install them using Homebrew on macOS or a Linux
package manager of your choice.

After you've installed the above and, run the following to install all the Ruby dependencies
and load the database with seed data.

### Getting Rails Up and Running

Run `bundle install` to install all of the packages listed in the Gemfile.

To set up the database, you should only need to run the following:

```
bundle exec rake db:create
bundle exec rake db:migrate
bundle exec rake db:seed
```

If you ever need to restart everything in the db from scratch, run `bundle exec rake db:nuke`.

## Running the project

- `cd client && npm start` to start the frontend
- `bin/rails s` to start the API server
- `bundle exec sidekiq` to start the worker
- `bundle exec rspec` to run the API test suite

To access emails, install [mailcatcher](https://github.com/sj26/mailcatcher) and
visit [http://localhost:1080](http://localhost:1080). If you're on a Mac, you
may have installation issues. Use the following line to install it:

gem install mailcatcher -- --with-cflags="-Wno-error=implicit-function-declaration"

## Development URLs

TODO: We should consider migrating everything to HTTPS to keep production and development more similar.

This is **_extremely important_**. Due to a number of CORS issues, you'll need to access the app
through a subdomain rather than through localhost.

- http://app.greenlightready.net is a loopback address that points to 127.0.0.1
- http://api.greenlightready.net is another loopback address that points to 127.0.0.1
- http://dev.glit.me/_ redirects to http://app.greenlightready.com:9991/_

The configurations are set up so that you can:

- access the frontend at http://app.greenlightready.net:9991
- access the backend at http://api.greenlightready.net:9990

I highly recommend that you use these addresses. You can alternatively modify your `/etc/hosts` file
to pick your own URL and set the appropriate environment variable your `.env.local` file.

If you don't want to have to type in ports, you can use the NGINX configurations avaiable at
`nginx-development.conf` to proxy requests to those addresses.

Speaking of `.env` files...

## Environment Variables and Configuration

We use `.env` files across both the backend and frontend for configuration during development and test.
The production environments use Heroku's built in environment configuration.

- `.env.local`: This is where you can put your own overrides, these should not be committed. This overrides everything.
- `.env.development`: This is where configuration for development goes.
- `.env.test`: This is where configuration for test goes.

TODO: We should consider migrating to Rails secrets management so that we can share configurations for testing
production-like endpoints that use all our third-party services.

If you look through the `.env.development` file, you'll find comments on what these variables mean.
These variables are validated in `config/initializers/001_environment_variables.rb`. The app should blow
up if things aren't set up properly.

## Running Cordova

- `npm run cordova-init` to install cordova platform and plugins
- `npm run run-cordova-ios` or `npm run run-cordova-android` to run the mobile app

There are a few other useful commands in the root `package.json` too.

## Coding Conventions

- Follow [Conventional Commits](https://conventionalcommits.org)
- Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0). When you do something please add it!
- Try to stay within 80 characters per line. It's okay if you go to 100. You'll
  get yelled at if you exceed 120.
- Follow style guides specific to the directories
- When in doubt, try to match what you see
- Use plugins for your editor (see Editor Setup) to conform to the style guides
- For Ruby, use YARD to document your types. This makes Solargraph's
  autocomplete smarter and will prepare us for the data when Ruby supports
  type checking natively.
- If Rubocop annoys you about anything ask Faraz if you can silence it. He'll probably say yes.

## Editor Setup

We don't really care what editor you use for as long as you follow the coding
conventions imposed by Rubocop and eslint. If something really annoys you, talk
to Faraz. He's probably fine with disabling it.

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
- [YARD Documentor](https://marketplace.visualstudio.com/items?itemName=pavlitsky.yard) press Ctrl+Alt+Enter (Option+Command+Enter on macOS) or invoke Document with YARD from the command palette.

If you're coming from Sublime, [this extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.sublime-keybindings) might come in handy.

If you're using VSCode, you should use the workspace specific configurations
provided in this repo.

## Comment Annotations

Prefix your comments with the following when an action item needs to be taken.

- TODO: There's something that needs to get done
- FIXME: There's something broken here.
- HACK: This is a temporary hack to get something working that needs improvement.
- PERF: There's something here that needs to be sped up.
- I18N: There's something that needs to be translated
- REFACTOR: The code is ugly.
- UGLY: The presentation to the user is ugly.

## Commit Messages

Prefix your commits with the following so we know what's happening. We aim to follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

- feat: new feature, corresponds to a MINOR version update
- fix: a bug fix corresponds to a PATCH version update
- docs: changes to the documentation
- style: formatting, missing semi colons, etc
- refactor: refactoring production code
- test: adding missing tests, refactoring tests;
- chore: updating tasks
- BREAKING CHANGE: when you shake things up

For commits associated with releases (e.g. the CHANGELOG update) use the following format:

- release: vMAJOR.MINOR.PATCH 🎊

Feel free to change the emoji.

## Short URLs

We have a short URL that is used to help access the app using text messages.
It's available across all of the environments:

- glit.me/_ redirects to app.greenlightready.com/_
- dev.glit.me/_ redirects to app-dev.greenlightready.com/_
- staging.glit.me/_ redirects to app-staging.greenlightready.com/_

This variable is set using the SHORT_URL environment variable.
## License

Greenlight is published under the GNU General Public License v3.0. Alternative
licensing is available for charge. Please contact faraz at greenlightready.com for details.

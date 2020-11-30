# Greenlight Mobile App 📱

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

If you expect anything to work, make sure you have the API up and running (one directory up). More complete directions are available in that README.

## Available Scripts

We use npm. From the project directory, you can run the following scrips:

 - `npm start`: This will run the app in development mode. Even though it will launch the app at localhost:9991, we recommend that you access the app from app.greenlightready.net:9991. The A record for app.greenlightready.net is already set to 127.0.0.1 so you shouldn't have to modify your hosts file or anything loaclly.
 - `npm test`: Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
 - `npm build`: Builds the app for production to the `build` folder. Everything should be optimized, minified and ready for deployment. More [here](https://facebook.github.io/create-react-app/docs/deployment).
 - `npm run i18n-extract`: Extracts messages from the app that need to be translated. This should be run once new messages are added in the app.
 - `npm run i18n-compile`: Compiles the messages in the JSON files into JavaScript files with strings can be interpolated. This should be run every time the messages are updated in the app.
 - `deploy.sh`: This script deploys the app to staging and production on Firebase hosting.
 - `npm run licenses`: This extracts all the license information to be shown on the open source licenses page.

## Directory Structure and Imortant Files

 - `/api`: Endpoints and store related modules go here.
 - `/assets`: Images, icons, fonts, general css, data, and other static assets go here.
 - `/components`: Components that are used across different pages go here.
 - `/config`: Configuration files. Specifically.
  - `/config/env`: Environemnt variables and related helepers go here.
  - `/config/routes`: Routes are defined here.
 - `/i18n`: This is where all the messages in the app go.
 - `/initializers`: All of these files run before the app is started.
 - `/helpers`: Dumping ground for things that don't belong anywhere else.
 - `/models`: Models in the app go here.
 - `/lib`: Place things here that could/should be extracted as their own modules.
 - `/pages`: Pages the app. These are components for individual screens
  - `/pages/:domain`: Domains provide organizational units for pages and places were subcomponents can be extracted.
  - `/pages/util`: These pages serve utility functions in the app, and aren't intended for direct consumption by the user.
 - `/types`: TypeScript type definitions go here, except for react-app-env since CRA keeps putting one in the root of the app. This is a [known issue](https://github.com/facebook/create-react-app/issues/6560)


## Conventions

 - Follow eslint. If something gets really annoying tell Faraz. You are free to use eslint-disable as an escape hatch, but be judicious.
 - Use functional components except for the ErrorBoundary component since it must be defined as a class component.
 - Prefer arrow functions when using anonymous functions. Only use `function() { }` if you need ensure `this` is unpolluted.
 - Use `React.memo` judisicously to speed up performance.
 - Do not define functions inside components, if we need to do that, use useCallback react hook.
 - For Yup schemas, defined them under the component.
 - Export any classes and components by default. The name of the file should match the component. Otherwise, export items individually. Only put multiple classes in one file when they are helper classes intended to support the default export.

### Import Order

 - First, import libraries from main modules (React and Framework7 related libraries)
 - Second, import libraries from npm modules (Formik, Yup, etc)
 - Third, import modules from the global scope
 - Firth, import modules from specific function scope
 - Finally, import files in the same folder

### Defining Components

In general, follow the order below:

 - Global State: `const [currentUser] = useGlobal('currentUser')`
 - Component State: `const [state, setState] = useState()`
 - Memoization: const value = `useMemo(...)`
 - Callbacks: const func = `useCallback()`
 - Effects: `useEffect()`
 - Return component

### I18n

We translate the app for our Spansih speakers. I've tried to keep things as uniform as possible to make it easier on the people doing the translation work. At some point, we should migrate to a service like weglot or weblate. For now we use lingui. For now, here are the guidelines.

 - Use a component macro like this `<Trans id="SomePage.hello_world">Hello World</Trans>` whenever you can. These are by far the most flexible, allowing you to easily nest components. Do not use ternary expressions inside of translations. You can use interpolation.
 - Use the `t` macro like this `t({ id: "SomePage.hello_world", message: "Hello World"})` when you need an expression. In the message, you can perform one level of interpolations. Do not use ternary expressions inside of translations.
 - Provide an id for all translations namespaced by the component name as shown above. If the message is used in many places across the app (e.g. "Sign Out") use the "Common" namespace.
 - Place all API translations in the APITranslationsPage component.

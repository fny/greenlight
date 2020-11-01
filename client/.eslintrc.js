module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  "env": {
    "browser": true,
    "es6": true
  },
  parserOptions: {
    project: "tsconfig.json"
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "airbnb-typescript"
  ],
  rules: {
    // TODO
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "class-methods-use-this": "off",
    "import/no-cycle": "off",
    "import/no-extraneous-dependencies": "off",
    "import/prefer-default-export": "off",
    "jsx-a11y/accessible-emoji": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/iframe-has-title": "off",
    "jsx-a11y/media-has-caption": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "max-classes-per-file": "off",
    "max-len": "off",
    "new-cap": "off",
    "no-continue": "off",
    "no-nested-ternary": "off",
    "no-param-reassign": "off",
    "no-restricted-syntax": "off",
    "no-underscore-dangle": "off",
    "react/destructuring-assignment": "off",
    "react/jsx-no-bind": "off",
    "react/jsx-props-no-multi-spaces": "off",
    "react/no-danger": "off",
    "react/no-unescaped-entities": "off",
    "react/no-unused-state": "off",
    "react/prefer-stateless-function": "off",
    "react/require-default-props": "off",
    "react/sort-comp": "off",
    "react/state-in-constructor": "off",
    "react/static-property-placement": "off",
  }
}
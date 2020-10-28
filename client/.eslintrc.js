module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  "env": {
    "browser": true,
    "es6": true
  },
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true // Allows for the parsing of JSX
    }
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    // "tslint-config-prettier"
  ],
  rules: {
    "semi": ["error", "never"],
    "no-unexpected-multiline": "off", // We use this for translations
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "none",
          "requireLast": false
        },
        "singleline": {
          "requireLast": false
        }
      }
    ]
  }
}

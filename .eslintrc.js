module.exports = {
  root: true,
  extends: ["@react-native-community", "prettier", "plugin:import/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "react/no-unstable-nested-components": 0,
    "no-use-before-define": 0,
    "no-empty-function": 0,
    "react-hooks/exhaustive-deps": 0,
    "eslint-comments/no-unlimited-disable": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/consistent-type-definitions": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "no-underscore-dangle": 0,
    "import/no-unresolved": 0,
  },
  settings: {
    "import/resolver": {
      "babel-module": {
        extensions: [".ts", ".tsx"],
      },
    },
  },
};

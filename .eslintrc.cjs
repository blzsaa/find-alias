module.exports = {
  env: {
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": "off",
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "always",
      },
    ],
  },
};

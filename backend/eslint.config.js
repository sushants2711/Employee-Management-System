import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      camelcase: ["error", { properties: "never" }],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
    },
  },
];

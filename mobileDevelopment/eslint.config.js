import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    ignores: ["node_modules", "dist", ".expo", "web-build"],
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      camelcase: ["error", { properties: "never" }],
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn"
    },
  },
];

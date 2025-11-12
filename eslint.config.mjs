import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        // Library globals used in the project
        Papa: "readonly",
        Chart: "readonly",
        // Test framework globals
        test: "readonly",
        expect: "readonly",
        // App globals exposed for testing
        seatCount: "writable",
        calculateMetrics: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-undef": "error",
    },
  },
  {
    ignores: ["node_modules/", "test-results/", "playwright-report/"],
  },
];

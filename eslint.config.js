const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  {
    files: ["**/*.js"], // Pliki, które mają być sprawdzane
    ignores: [
      "**/node_modules/**", // Ignoruj cały katalog node_modules
      "**/dist/**", // Ignoruj cały katalog dist
      "**/build/**", // Ignoruj cały katalog build
      "**/eslint.config.js", // Ignoruj plik eslint.config.js
      "**/prettier.config.js", // Ignoruj plik prettier.config.js
      "**/.prettierrc.json", // Ignoruj plik .prettier.json
    ],

    languageOptions: {
      ecmaVersion: "latest", // Użyj najnowszej wersji ECMAScript
      sourceType: "commonjs", // Projekt używa CommonJS (require/module.exports)
      globals: {
        process: "readonly",
        __dirname: "readonly",
      },
    },
    plugins: {
      prettier: require("eslint-plugin-prettier"), // Włącz Prettier jako plugin ESLint
    },
    rules: {
      // Ogólne reguły ESLint
      "no-console": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

      // Integracja z Prettier
      "prettier/prettier": "error", // Włącz regułę Prettiera, która zgłasza błędy formatowania
    },
    linterOptions: {
      reportUnusedDisableDirectives: true, // Zgłaszaj nieużywane dyrektywy disable ESLint
    },
  },
  eslintConfigPrettier, // Wyłącza reguły ESLint, które mogą kolidować z Prettier
];

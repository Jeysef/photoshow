/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 4,
  useTabs: false,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  bracketSpacing: true,
  arrowParens: "always",
  printWidth: 160,
  overrides: [
    {
      files: ["*.json", "*.yml"],
      options: {
        tabWidth: 2,
      },
    },
  ],
};

export default config;

import antfu from "@antfu/eslint-config";

export default antfu({
  type: "app",
  typescript: true,
  astro: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["src/assets/rathena_db/**", "docs/**"],
}, {
  rules: {
    "ts/no-redeclare": "off",
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": ["warn"],
    "antfu/no-top-level-await": ["off"],
    "node/prefer-global/process": ["off"],
    "node/no-process-env": ["error"],
    "perfectionist/sort-imports": [
      "error",
      {
        tsconfigRootDir: ".",
      },
    ],
    "unicorn/filename-case": [
      "error",
      {
        cases: { kebabCase: true, pascalCase: true },
        ignore: ["README.md"],
      },
    ],
  },
});

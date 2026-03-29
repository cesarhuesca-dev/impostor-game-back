// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  // eslintPluginPrettierRecommended,
  // eslint.configs.recommended,
  // ...tseslint.configs.recommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
       "@typescript-eslint/no-unsafe-call": "off",
      "no-multiple-empty-lines": ["error", { "max": 3, "maxBOF": 3, "maxEOF": 3 }],
      "comma-dangle" : [ "error", {
          "objects": "ignore",
          "arrays": "ignore",
          "imports": "ignore",
          "exports": "ignore",
          "functions": "ignore"
        }
      ]
    },
  }
);

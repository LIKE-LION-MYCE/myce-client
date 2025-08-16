// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    ignores: ["dist", "build", "node_modules"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    plugins: {
      import: importPlugin,
      "react-hooks": reactHooks,
    },

    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"], // 이 확장자까지 import 해석
          caseSensitive: true, // 대소문자 구분 엄격히 적용
        },
      },
    },

    rules: {
      // import 경로 대소문자/불일치만 에러 처리
      "import/no-unresolved": ["error", { caseSensitive: true }], // 경로 불일치 시 에러

      // 나머지 소음 규칙 끄기
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-case-declarations": "off",
      "no-empty": "off",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];

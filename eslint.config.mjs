import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // 불필요한 변수는 경고로 표시
      'no-unused-vars': 'warn',
      // 개발 중 콘솔 사용은 허용하되, 배포 전 경고
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // 코드 일관성 및 가독성 향상
      'prettier/prettier': 'error',
      // import 순서 자동 정렬 권장
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      // 명확한 함수 반환 타입 권장 (TypeScript)
      '@typescript-eslint/explicit-function-return-type': 'warn',
      // any 타입 사용 최소화
      '@typescript-eslint/no-explicit-any': 'warn',
      // 불필요한 disable 주석 방지
      'eslint-comments/no-unlimited-disable': 'error',
    },
  },
  eslintConfigPrettier,
];

export default eslintConfig;

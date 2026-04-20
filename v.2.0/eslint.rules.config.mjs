import firebaseRulesPlugin from '@firebase/eslint-plugin-security-rules';

const recommended = firebaseRulesPlugin.configs['flat/recommended'];

export default [
  {
    ...recommended,
    files: ['**/*.rules'],
  }
];

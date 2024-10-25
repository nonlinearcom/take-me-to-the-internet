import antfu from '@antfu/eslint-config'

export default antfu(
  {
    formatters: true,
    // Or customize the stylistic rules
    stylistic: {
      indent: 2, // 4, or 'tab'
      quotes: 'single', // or 'double'
    },
    vue: true,
    typescript: true,
    ignores: [
      'dist',
      'node_modules',
      'public',
    ],
  },
  {
  // Without `files`, they are general rules for all files
    rules: {
      'style/semi': ['error', 'never'],
      'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      'vue/no-v-text-v-html-on-component': 'off',

      'no-console': 'off',
      'antfu/top-level-function': 'off',
      'unused-imports/no-unused-vars': 'off',

      'node/prefer-global/process': 'off',

      'ts/no-invalid-this': 'off',
      'ts/consistent-type-imports': 'off',
      'ts/ban-types': 'off',

      'vue/block-order': ['error', {
        order: ['template', 'script', 'style'],
      }],

      'vue/max-attributes-per-line': ['warn', {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
    },
  },
)

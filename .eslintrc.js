module.exports = {
	root: true,
	env: {
	  browser: true,
	  node: true
	},
	parserOptions: {
	  parser: '@babel/eslint-parser',
	  requireConfigFile: false
	},
	extends: [
	  '@nuxtjs',
	  'plugin:nuxt/recommended',
	  'prettier'
	],
	plugins: [
	],
	// add your custom rules here
	rules: {
		'no-console': 'off',
		// 'no-unused-vars': 'off',
		// 'no-unexpected-multiline': 'error',
		'no-irregular-whitespace': [
			'error',
			{
				skipTemplates: true,
			},
		],
		'vue/no-v-html': 'off',
	},
  }


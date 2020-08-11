module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
	extends: [
		'@nuxtjs',
		'prettier',
		'prettier/vue',
		'plugin:prettier/recommended',
		'plugin:nuxt/recommended',
	],
	plugins: ['prettier'],
	// add your custom rules here
	rules: {
		endOfLine: 0,
		semi: [2, 'never'],
		'no-console': 'off',
		'no-unused-vars': 'off',
		'no-unexpected-multiline': 'error',
		'no-irregular-whitespace': [
			'error',
			{
				skipTemplates: true,
			},
		],
		'vue/no-v-html': 'off',
	},
}

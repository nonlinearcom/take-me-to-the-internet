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
		'plugin:prettier/recommended',
		'plugin:nuxt/recommended',
	],
	plugins: [],
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

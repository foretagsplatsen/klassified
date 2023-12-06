module.exports = {
	parserOptions: {
		"ecmaVersion": 6,
		"sourceType": "module"
	},
	root: true,
	extends: "ftgp",
	rules: {
		"quotes": ["error", "double"],
		"ftgp/require-class-comment": 0
	}
};

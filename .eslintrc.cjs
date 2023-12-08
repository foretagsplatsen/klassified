module.exports = {
	parserOptions: {
		"ecmaVersion": 6,
		"sourceType": "module"
	},
	root: true,
	extends: [ "plugin:@foretagsplatsen/main" ],
	rules: {
		"quotes": ["error", "double"],
		"ftgp/require-class-comment": 0,
		"import/no-unused-modules": [
			"error",
			{
				unusedExports: true,
				missingExports: true,
				ignoreExports: [
					// List of files exporting stuff which are not imported:
					"src/klassified.js",
					// List of files not exporting anything:
					"**/.eslintrc.cjs",
					"src/property.js"
				],
			},
		]
	}
};

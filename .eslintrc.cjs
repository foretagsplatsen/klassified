module.exports = {
	root: true,
	extends: ["plugin:@foretagsplatsen/main"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2022,
	},
	rules: {
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
					"src/property.js",
				],
			},
		],
	},
};

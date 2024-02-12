module.exports = {
	root: true,
	extends: ["plugin:@foretagsplatsen/main"],
	ignorePatterns: ["test/custom-boot.js"],
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
		// As this project is deprecated, we are disabling rules we
		// don't want to fix:
		"max-params": "off",
		"no-shadow": "off",
		"no-unused-vars": "off",
		"logical-assignment-operators": "off",
	},
};

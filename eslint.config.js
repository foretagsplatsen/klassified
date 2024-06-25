import finsitPlugin from "@foretagsplatsen/eslint-plugin";
import jasminePlugin from "eslint-plugin-jasmine";
import globals from "globals";

export default [
	...finsitPlugin.configs.main,
	{
		name: "klassified: global ignores",
		ignores: ["test/custom-boot.js"],
	},
	{
		name: "klassified: rules",
		rules: {
			"import/no-unused-modules": ["off"],
			// As this project is deprecated, we are disabling rules
			// we don't want to fix:
			"logical-assignment-operators": "off",
			"no-shadow": "off",
			"no-unused-vars": "off",
			"max-params": "off",
		},
	},
	{
		name: "klassified: Use jasmine plugin for tests",
		files: ["test/**/*.js"],
		plugins: { jasmine: jasminePlugin },
		languageOptions: { globals: { ...globals.jasmine } },
		rules: { ...jasminePlugin.configs.recommended.rules },
	},
	{
		name: "klassified: Add jasmine globals to src/testCase.js",
		files: ["src/testCase.js"],
		languageOptions: { globals: { ...globals.jasmine } },
	},
];

/* eslint-env node */

// Jasmine configuration options
jasmine.DEFAULT_TIMEOUT_INTERVAL = 200;

require(["./tests"], (options) => {
	let config = options.config;
	config.baseUrl = "../";
	require.config(config);

	require(["./config"], () => {
		require(options.files, (files) => {
			jasmine.getEnv().execute();
		});
	});
});

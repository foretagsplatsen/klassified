require.config({baseUrl: "/base"});

require(["./test/tests"], function(options) {
	var config = options.config;
	config.baseUrl = "/base";
	require.config(config);

	require(["./config"], function() {
		require(options.files, function(files) {
			window.__karma__.start(files);
		});
	});
});

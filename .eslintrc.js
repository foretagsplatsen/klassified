(function() {
	var error = 2;

	module.exports = {
		root: true,
		extends: "ftgp",
		rules: {
			"quotes": [error, "double"],
			"ftgp/require-class-comment": 0
		}
	};
})();

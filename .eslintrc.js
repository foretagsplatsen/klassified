(function() {
	var error = 2;

	module.exports = {
		root: true,
		extends: "ftgp",
		env: {
			es6: true
		},
		rules: {
			"quotes": [error, "double"],
			"ftgp/require-class-comment": 0
		}
	};
})();

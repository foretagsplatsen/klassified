(function() {
	let error = 2;

	module.exports = {
		parser: "babel-eslint",
		root: true,
		extends: "ftgp",
		rules: {
			"quotes": [error, "double"],
			"ftgp/require-class-comment": 0
		}
	};
})();

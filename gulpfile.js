var gulp = require("gulp");
var del = require("del");
var Server = require("karma").Server;

var plugins = require("gulp-load-plugins")({
	rename: {
		"gulp-eslint": "eslint",
		"gulp-shell": "shell",
		"gulp-phantom": "phantom",
		"gulp-strip-code": "stripCode",
		"gulp-sequence": "sequence",
		"gulp-requirejs-optimize": "optimizer"
	}
});

var sources = ["./src/**/*.js"];
var misc = ["./gulpfile.js", "./eslintrc.js"];
var tests = ["./test/**/*.js"];
var all = sources.slice().concat(misc).concat(tests);

gulp.task("default", ["lint", "test"]);

// Lint

gulp.task("lint", ["js-lint"]);

gulp.task("js-lint", function() {
	return gulp.src(all)
		.pipe(plugins.eslint())
		.pipe(plugins.eslint.format("unix"))
		.pipe(plugins.eslint.failAfterError());
});

// Test

gulp.task("test", function(done) {
	new Server({
		configFile: __dirname + "/karma.conf.js",
		singleRun: true
	}, done).start();
});

//
// Deploy
//

gulp.task("strip", function() {
	return gulp.src(sources)
		.pipe(plugins.stripCode({
			start_comment: "start-test",
			end_comment: "end-test"
		}))
		.pipe(gulp.dest("strip"));
});

var requireJSOptions = {
	mainConfigFile: "./config.js",
	name: "../node_modules/almond/almond",
	wrap: true,
	findNestedDependencies: true
};

gulp.task("optimize", ["strip"], function() {
	var options = Object.assign(requireJSOptions);
	options.optimize = "none";
	options.include = ["objectjs"];
	options.insertRequire = ["objectjs"];
	options.out = "objectjs.js";

	return gulp.src("strip/objectjs.js")
		.pipe(plugins.optimizer(options))
		.pipe(gulp.dest("dist"));
});

gulp.task("optimize:minify", ["strip"], function() {
	var options = Object.assign(requireJSOptions);
	delete options.optimize;
	options.include = ["objectjs"];
	options.insertRequire = ["objectjs"];
	options.out = "objectjs.min.js";

	return gulp.src("strip/objectjs.js")
		.pipe(plugins.optimizer(options))
		.pipe(gulp.dest("dist"));
});

gulp.task("build", plugins.sequence(
	"optimize",
	"optimize:minify",
	"clean:strip"
));

//
// Clean
//

gulp.task("clean:strip", function(cb) {
	del([
		"strip"
	], cb);
});

gulp.task("clean:build", function(cb) {
	del([
		"dist"
	], cb);
});

gulp.task("clean", plugins.sequence([
	"clean:build",
	"clean:strip"
]));

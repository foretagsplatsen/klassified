require("babel-core/register");

const gulp = require("gulp");
const gutil = require("gulp-util");
const del = require("del");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");

const plugins = require("gulp-load-plugins")({
	rename: {
		"gulp-babel-istanbul": "istanbul"
	}
});

let sources = ["./src/**/*.js"];
let misc = ["./gulpfile.js", "./eslintrc.js"];
let tests = ["./test/**/*.js"];
let all = sources.slice().concat(misc).concat(tests);

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

gulp.task("coverage", () => {
	return gulp.src(sources)
		.pipe(plugins.istanbul())
		.pipe(plugins.istanbul.hookRequire());
});

gulp.task("test", ["coverage"], function(done) {
	let oldDefine = global.define;

	global.define = (a, fn) => fn();

	let conf = require("./test/tests");
	let result = gulp.src(conf.files.map((path) => path + ".js"))
		.pipe(plugins.jasmine({
			includeStackTrace: true
		}))
		.pipe(plugins.istanbul.writeReports())
		.pipe(plugins.istanbul.enforceThresholds({ thresholds: { global: 75 } }));

	global.define = oldDefine;
	return result;
});

//
// Deploy
//

gulp.task("optimize", function() {
	let babelify = require("babelify");

	let b = browserify({
		standalone: "klassified",
		entries: "./src/klassified.js",
		debug: true,
		transform: [babelify]
	});

	return b.bundle()
		.pipe(source("klassified.js"))
		.pipe(buffer())
		.pipe(plugins.sourcemaps.init({ loadMaps: true }))
		.on("error", gutil.log.bind(gutil, "Browserify Error"))
		.pipe(plugins.sourcemaps.write("./"))
		.pipe(gulp.dest("dist"));
});

gulp.task("optimize:minify", function() {
	let babelify = require("babelify");

	let b = browserify({
		standalone: "klassified",
		entries: "./src/klassified.js",
		debug: true,
		transform: [babelify]
	});

	return b.bundle()
		.pipe(source("klassified.min.js"))
		.pipe(buffer())
		.pipe(plugins.sourcemaps.init({ loadMaps: true }))
		// Add transformation tasks to the pipeline here.
		.pipe(plugins.uglify())
		.on("error", gutil.log.bind(gutil, "Browserify Error"))
		.pipe(plugins.sourcemaps.write("./"))
		.pipe(gulp.dest("dist"));
});

gulp.task("build", plugins.sequence(
	"optimize",
	"optimize:minify",
	"clean:strip"
));

//
// Release
//

gulp.task("bump:patch", function() {
	return gulp.src("./package.json")
		.pipe(plugins.bump({ type: "patch" }))
		.pipe(gulp.dest("./"));
});

gulp.task("bump:minor", function() {
	return gulp.src("./package.json")
		.pipe(plugins.bump({ type: "minor" }))
		.pipe(gulp.dest("./"));
});

gulp.task("bump:major", function() {
	return gulp.src("./package.json")
		.pipe(plugins.bump({ type: "major" }))
		.pipe(gulp.dest("./"));
});

gulp.task("release:patch", ["bump:patch", "build"], function() {});
gulp.task("release:minor", ["bump:minor", "build"], function() {});
gulp.task("release:major", ["bump:major", "build"], function() {});

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

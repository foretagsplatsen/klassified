var gulp = require("gulp");
var del = require("del");
var Server = require("karma").Server;

var plugins = require("gulp-load-plugins")({
    rename: {
        "gulp-eslint": "eslint",
        "gulp-shell": "shell",
        "gulp-phantom": "phantom",
        "gulp-strip-code": "stripCode"
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

// Todo: minify
gulp.task("build", function() {
    gulp.src(sources)
        .pipe(plugins.stripCode({
            start_comment: "start-test",
            end_comment: "end-test"
        }))
        .pipe(gulp.dest("dis"));
});

//
// Clean
//

gulp.task("clean", function(cb) {
    del([
        "dist"
    ], cb);
});

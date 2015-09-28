var gulp = require('gulp');
var plug = require('gulp-load-plugins')();

var source = [
	'./static/app/**/*module*.js',
	'./static/app/**/*.js'
];

gulp.task('ngAnnotateTest', function() {
	return gulp
	.src(source)
	.pipe(plug.ngAnnotate({add: true, single_quotes: true}))
	.pipe(plug.rename(function(path) {
		path.extname = '.annotated.js';
	}))
	.pipe(plug.uglify({mangle: true}))
	.pipe(gulp.dest('./build'));
});

/**
 * serve the build environment
 */
gulp.task('serve-build', function() {
    serve({
        mode: 'build'
    });
});

/**
 * Backwards compatible call to make stage and build equivalent
 */
gulp.task('serve-stage', ['serve-build'], function() {});
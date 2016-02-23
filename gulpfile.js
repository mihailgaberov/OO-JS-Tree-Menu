// Grab our gulp packages
var gulp  = require('gulp'),
    jshint = require('gulp-jshint');

// Create a default task and add the watch to it
gulp.task('default', ['watch']);

// Configure the jshint task
gulp.task('jshint', function() {
	return gulp.src('*.js').pipe(jshint()).pipe(jshint.reporter('jshint-stylish'));
});

// Configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
	gulp.watch('*.js', ['jshint']);
});
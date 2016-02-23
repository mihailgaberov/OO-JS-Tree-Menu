// Grab our gulp packages
var gulp  = require('gulp'),
	gutil = require('gulp-util');
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass');


var input = {
    	'sass': 'src/scss/**/*.scss',
      	'javascript': 'src/js/**/*.js',
    },

    output = {
    	'stylesheets': 'build/css',
      	'javascript': 'build/js'
    };


// Create a default task and add the watch to it
gulp.task('default', ['watch']);

// Configure the jshint task
gulp.task('jshint', function() {
	return gulp.src('src/js/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter('jshint-stylish'));
});

/* compile scss files */
gulp.task('build-css', function() {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.stylesheets));
});

/* Concat javascript files, minify if --type production */
gulp.task('build-js', function() {
  return gulp.src(input.javascript)
    .pipe(sourcemaps.init())
     //only uglify if gulp is ran with '--type production'
    .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output.javascript));
});

// Configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
	gulp.watch(input.javascript, ['jshint', 'build-js']);
	gulp.watch(input.sass, ['build-css']);
});
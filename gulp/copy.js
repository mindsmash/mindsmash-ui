var gulp = require('gulp');
var replace = require('gulp-replace');

// ----------------------------------------------------------------------------------------------------

var REMOVE_LINE_TOKEN = /.*@@gulp-remove-line.*/g;

// ----------------------------------------------------------------------------------------------------

/**
 * Copies the mindsmash-ui kit source SCSS files into the 'dist' folder. Remember, developers don't want to use a
 * fully compiled version of mindsmash-ui. They want to integrate mindsmash-ui into their own build process so that
 * they can change variables.
 */
gulp.task('copy:styles', function () {
  gulp.src('source/kit/stylesheets/**/*')
      .pipe(replace(REMOVE_LINE_TOKEN, ''))
      .pipe(replace('../../../bower_components', '../../../..'))
      .pipe(gulp.dest('dist/kit/stylesheets/'));

  return gulp.src('source/kit/components/**/*.scss')
      .pipe(gulp.dest('dist/kit/components/'));
});
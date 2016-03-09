var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

// ----------------------------------------------------------------------------------------------------

gulp.task('default', ['build']); // default task

/**
 * Main build task that procudes the 'dist' folder.
 */
gulp.task('build', gulpSequence(
  'styles:build',
  'scripts:build',
  'inject:build'
));
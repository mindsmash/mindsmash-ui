var gulp = require('gulp');
var del = require('del');

// ----------------------------------------------------------------------------------------------------

/**
 * Cleans up 'dist' and '.tmp'.
 */
gulp.task('clean', function() {
  return del.sync(['dist/**', '.tmp/**']);
});

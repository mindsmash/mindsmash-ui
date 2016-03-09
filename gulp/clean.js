var gulp = require('gulp');
var del = require('del');

// ----------------------------------------------------------------------------------------------------

/**
 * Cleans up 'dist', 'docs' and '.tmp'.
 */
gulp.task('clean', function() {
  return del.sync(['dist/**', 'docs/**', '.tmp/**']);
});

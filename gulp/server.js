var gulp = require('gulp');
var browserSync = require('browser-sync');
var gulpSequence = require('gulp-sequence');

// ----------------------------------------------------------------------------------------------------

/**
 * The main task to use during development.
 *
 * First compiles SCSS, then injects dependencies into '.tmp/index.html' and finally starts the development server.
 */
gulp.task('dev', gulpSequence('styles:dev', 'inject:dev', 'serve:dev'));
gulp.task('serve', ['dev']); //alias

// ----------------------------------------------------------------------------------------------------

/**
 * Starts the development server. Useful during development.
 */
gulp.task('serve:dev', function () {
  browserSync({
    notify: false,
    port: 8000,
    ui: {
      port: 8001
    },
    file: true,
    server: {
      baseDir: '.tmp',
      routes: {
        '/bower_components': 'bower_components',
        '/source': 'source'
      }
    }
  });

  gulp.watch('source/**/*.js').on('change', browserSync.reload);
  gulp.watch('source/**/*.scss', ['styles:dev']).on('change', browserSync.reload);
});

// ----------------------------------------------------------------------------------------------------

/**
 * Starts a server with the dist resources. Useful for checking if the dist has completed successfully.
 */
gulp.task('serve:dist', ['build'], function () {
  browserSync({
    notify: false,
    port: 8000,
    ui: {
      port: 8001
    },
    file: true,
    server: {
      baseDir: 'dist/docs'
    }
  });
});


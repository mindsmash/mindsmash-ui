var gulp = require('gulp');
var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');
var gulpSequence = require('gulp-sequence');

// ----------------------------------------------------------------------------------------------------

/**
 * The main task to use during development.
 *
 * First compiles SCSS, then injects dependencies into '.tmp/index.html' and finally starts the development server.
 */
gulp.task('docs', gulpSequence('styles:dev', 'inject:dev', 'docs:dev'));
gulp.task('serve', ['docs']); //alias
gulp.task('dev', ['docs']); //alias

// ----------------------------------------------------------------------------------------------------

/**
 * Starts the development server. Useful during development.
 */
gulp.task('docs:dev', function () {
  browserSync.use(browserSyncSpa({
    selector: "[ng-app]"
  }));

  browserSync({
    notify: false,
    port: 8000,
    ui: {
      port: 8001
    },
    startPath: '/',
    server: {
      baseDir: '.tmp',
      routes: {
        '/bower_components': 'bower_components',
        '/source': 'source',
        '/components': 'source/kit/components',
        '/app': 'source/docs/app'
      }
    }
  });

  gulp.watch('source/**/*.js', ['inject:dev']).on('change', browserSync.reload);
  gulp.watch('source/**/*.html', ['inject:dev']).on('change', browserSync.reload);
  gulp.watch('source/**/*.scss', ['styles:dev']).on('change', browserSync.reload);
  gulp.watch('source/docs/index.html', ['inject:dev']).on('change', browserSync.reload);
});

// ----------------------------------------------------------------------------------------------------

/**
 * Starts a server with the dist resources. Useful for checking if the dist has completed successfully.
 */
gulp.task('docs:dist', ['build'], function () {
  browserSync.use(browserSyncSpa({
    selector: "[ng-app]"
  }));

  browserSync({
    notify: false,
    port: 8000,
    ui: {
      port: 8001
    },
    file: true,
    server: {
      baseDir: 'docs'
    }
  });
});


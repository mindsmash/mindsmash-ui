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

  gulp.watch('source/**/*.js', ['docs:dev:reload']);
  gulp.watch('source/**/*.html', ['docs:dev:reload']);
  gulp.watch('source/**/*.scss', ['docs:dev:restyle']);
  gulp.watch('source/docs/index.html', ['docs:dev:reload']);
});

// ----------------------------------------------------------------------------------------------------

gulp.task('docs:dev:reload', ['inject:dev'], function(){
  browserSync.reload();
});

gulp.task('docs:dev:restyle', ['styles:dev'], function(){
  browserSync.reload();
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


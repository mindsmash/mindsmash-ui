var gulp = require('gulp');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var mainBowerFiles = require('gulp-main-bower-files');
var concat = require('gulp-concat');
var filter = require('gulp-filter');


// ----------------------------------------------------------------------------------------------------

/**
 * Creates readable CSS from SCSS files.
 */
gulp.task('styles:dev', ['styles:dev:kit', 'styles:dev:docs']);

// ----------------------------------------------------------------------------------------------------

/**
 * Compiles the SCSS of the mindsmash-ui kit into a single CSS file at '.tmp/css/mindsmash-ui.css'.
 */
gulp.task('styles:dev:kit', function () {
  return gulp.src('source/kit/stylesheets/mindsmash-ui.scss')
      .pipe(scsslint())
      .pipe(sass({outputStyle: 'compact', precision: 8}).on('warning', gutil.log))
      .pipe(gulp.dest('.tmp/css'));
});

// ----------------------------------------------------------------------------------------------------

/**
 * Compiles the SCSS of the docs into a single CSS file at '.tmp/css/docs.css'.
 */
gulp.task('styles:dev:docs', function () {
  return gulp.src('source/docs/**/*.scss')
      .pipe(sass({outputStyle: 'compact'}).on('warning', gutil.log))
      .pipe(gulp.dest('.tmp/css'));
});

// ----------------------------------------------------------------------------------------------------

/**
 * Compiles the SCSS of the mindsmash-ui kit and the docs for distribution.
 */
gulp.task('styles:build', ['styles:build:kit', 'styles:build:docs']);

// ----------------------------------------------------------------------------------------------------

/**
 * Compiles the SCSS of the mindsmash-ui kit to 'dist/stylesheets/css/...'. Also puts the same file
 * to 'docs/...' so that the docs can be started standalone.
 */
gulp.task('styles:build:kit', ['copy:styles'], function () {
  return gulp.src('source/kit/stylesheets/mindsmash-ui.scss')
      .pipe(scsslint())
      .pipe(sass({outputStyle: 'compact'}).on('error', gutil.log))
      .pipe(gulp.dest('dist/stylesheets/css'))
      .pipe(gulp.dest('docs/stylesheets'))
      .pipe(sass({outputStyle: 'compressed'}).on('error', gutil.log))
      .pipe(rename(function (path) {
        path.basename += ".min";
        return path;
      }))
      .pipe(gulp.dest('dist/stylesheets/css'));
});

// ----------------------------------------------------------------------------------------------------

/**
 * Compiles the SCSS of the docs as well as the required vendor CSS.
 */
gulp.task('styles:build:docs', ['styles:build:docs:app', 'styles:build:docs:vendor']);

// ----------------------------------------------------------------------------------------------------

/**
 * Compiles the SCSS of the docs
 */
gulp.task('styles:build:docs:app', function () {
  return gulp.src('source/docs/docs.scss')
      .pipe(sass({outputStyle: 'compact'}).on('error', gutil.log))
      .pipe(gulp.dest('docs/stylesheets'));
});

// ----------------------------------------------------------------------------------------------------

/**
 * Merges the CSS of all bower_components.
 */
gulp.task('styles:build:docs:vendor', function () {
  return gulp.src('bower.json')
      .pipe(mainBowerFiles())
      .pipe(filter('**/*.css'))
      .pipe(concat('vendor.css'))
      .pipe(gulp.dest('docs/stylesheets'));
});
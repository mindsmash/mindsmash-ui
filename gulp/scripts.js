var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var mainBowerFiles = require('gulp-main-bower-files');
var filter = require('gulp-filter');

// ----------------------------------------------------------------------------------------------------

/**
 * Merges JS in the following order:
 *
 * 1. mindsmash-ui kit
 * 2. Custom JS for the docs
 * 3. Vendor JS
 */
gulp.task('scripts:build', ['scripts:build:kit', 'scripts:build:docs']);

// ----------------------------------------------------------------------------------------------------

/**
 * Merges the JS of the mindsmash-ui kit and also creates a minified version.
 */
gulp.task('scripts:build:kit', function () {
  var precompiledTemplates = gulp.src('source/kit/**/*.html')
      .pipe(templateCache('templateCache.js', {module: 'msm.components.ui'}));

  var componentScripts = gulp.src(['source/kit/**/*.module.js', 'source/kit/**/*.js']);

  return merge(precompiledTemplates, componentScripts)
      .pipe(concat('mindsmash-ui.js'))
      .pipe(gulp.dest('dist/kit'))
      .pipe(gulp.dest('dist/docs'))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min";
        return path;
      }))
      .pipe(gulp.dest('dist/kit'));
});

// ----------------------------------------------------------------------------------------------------

/**
 * Merges the JS for the docs.
 */
gulp.task('scripts:build:docs', ['scripts:build:docs:app', 'scripts:build:docs:vendor']);

// ----------------------------------------------------------------------------------------------------

/**
 * Merges the custom JS of the docs and puts them to 'dist/docs/docs.js'.
 */
gulp.task('scripts:build:docs:app', function () {
  var precompiledTemplates = gulp.src([
    '!source/docs/index.html',
    'source/docs/**/*.html'
  ]).pipe(templateCache('templateCache.js', {module: 'msm.docs'}));

  var componentScripts = gulp.src([
    'source/docs/**/*.app.js',
    'source/docs/**/*.module.js',
    'source/docs/**/*.js'
  ]);

  return merge(precompiledTemplates, componentScripts)
      .pipe(concat('docs.js'))
      .pipe(gulp.dest('dist/docs'));
});

// ----------------------------------------------------------------------------------------------------

/**
 * Merges the JS of the bower_components and puts them to 'dist/docs/vendor.js'.
 */
gulp.task('scripts:build:docs:vendor', function () {
  return gulp.src('bower.json')
      .pipe(mainBowerFiles())
      .pipe(filter('**/*.js'))
      .pipe(concat('vendor.js'))
      .pipe(gulp.dest('dist/docs'));
});
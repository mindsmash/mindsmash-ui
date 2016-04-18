var gulp = require('gulp');
var wiredep = require('wiredep');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var injectString = require('gulp-inject-string');
var series = require('stream-series');

// ----------------------------------------------------------------------------------------------------

/**
 * Copies the docs/index.html to '.tmp' and injects the following dependencies:
 *
 * 1. Bower dependencies (via wiredep)
 * 2. mindsmash-ui kit
 * 3. Custom JS and CSS for the docs
 */
gulp.task('inject:dev', function () {
  var kitSources = series(
      gulp.src('.tmp/css/mindsmash-ui.css', {read: false}),
      gulp.src('source/kit/**/*.module.js', {read: false}),
      gulp.src([
        '!source/kit/**/*.module.js',
        'source/kit/**/*.js'
      ], {read: false})
  );

  var docsSources = series(
      gulp.src('.tmp/css/docs.css', {read: false}),
      gulp.src('source/docs/**/*.app.js', {read: false}),
      gulp.src('source/docs/**/*.module.js', {read: false}),
      gulp.src([
        '!source/docs/**/*.app.js',
        '!source/docs/**/*.module.js',
        'source/docs/**/*.js'
      ], {read: false})
  );

  return gulp.src('source/docs/index.html')
      .pipe(gulp.dest('.tmp'))
      .pipe(wiredep.stream({
        devDependencies: true,
        onError: gutil.log,
        onMainNotFound: gutil.log,
        onFileUpdated: gutil.log
      }))
      .pipe(inject(kitSources, {name: 'kit', relative: true}))
      .pipe(inject(docsSources, {name: 'docs', relative: true}))
      .pipe(injectString.after('<head>', '\n  <base href="/" />\n'))
      .pipe(gulp.dest('.tmp'));
});

// ----------------------------------------------------------------------------------------------------

/**
 * Copies the docs/index.html to 'docs' and injects the following dependencies:
 *
 * 1. mindsmash-ui kit
 * 2. Vendor CSS and JS
 * 3. Custom JS and CSS for the docs
 */
gulp.task('inject:build', function () {
  return gulp.src('source/docs/index.html')
      .pipe(gulp.dest('docs'))
      .pipe(inject(gulp.src('docs/**/mindsmash-ui.*', {read: false}), {name: 'kit', relative: true}))
      .pipe(inject(gulp.src('docs/**/vendor.*', {read: false}), {name: 'vendor', relative: true}))
      .pipe(inject(gulp.src('docs/**/docs.*', {read: false}), {name: 'docs', relative: true}))
      .pipe(injectString.after('<head>', '\n  <base href="/mindsmash-ui/docs" />\n'))
      .pipe(gulp.dest('docs'));
});

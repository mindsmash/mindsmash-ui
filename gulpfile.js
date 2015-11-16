var del  = require('del');
var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');

var BOOTSTRAP_PLACEHOLDER = '//-bootstrap-autoimport',
    BOOTSTRAP_SCSS_PATH = '"../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap"';

// start development
gulp.task('default', ['dev']);

// start scss watch mode
gulp.task('dev', ['sass'], function () {
  gulp.watch('source/stylesheets/**/*.scss', ['sass']);
});

// create normal and minified versions
gulp.task('build', ['clean', 'sass', 'sass-min', 'copy-sass']);

// create readable css from scss files
gulp.task('sass', function () {
  return gulp.src('source/stylesheets/*.scss')
    .pipe(replace(BOOTSTRAP_PLACEHOLDER, '@import ' + BOOTSTRAP_SCSS_PATH + ';'))
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/stylesheets/css'))
});

// create minified css files
gulp.task('sass-min', function () {
  return gulp.src('source/stylesheets/*.scss')
    .pipe(replace(BOOTSTRAP_PLACEHOLDER, '@import ' + BOOTSTRAP_SCSS_PATH + ';'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename(function (path) {
      path.basename += ".min";
      return path;
    }))
    .pipe(gulp.dest('dist/stylesheets/css'))
});

//copy scss files
gulp.task('copy-sass', function () {
  return gulp.src('source/stylesheets/*')
    .pipe(replace(BOOTSTRAP_PLACEHOLDER, ''))
    .pipe(gulp.dest('dist/stylesheets/scss/'));
});

// delete dist folder
gulp.task('clean', function () {
  return del(['dist/*']);
});

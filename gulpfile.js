var browserSync = require('browser-sync');
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
gulp.task('dev', ['sass:dev', 'serve']);

// create normal and minified versions
gulp.task('build', ['clean', 'sass:build', 'copy-sass']);

// create readable css from scss files
gulp.task('sass:dev', function () {
  return gulp.src('source/stylesheets/*.scss')
    .pipe(replace(BOOTSTRAP_PLACEHOLDER, '@import ' + BOOTSTRAP_SCSS_PATH + ';'))
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('.tmp/css'))
});

// create minified css files
gulp.task('sass:build', function () {
  return gulp.src('source/stylesheets/*.scss')
    .pipe(replace(BOOTSTRAP_PLACEHOLDER, '@import ' + BOOTSTRAP_SCSS_PATH + ';'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/stylesheets/css'))
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

gulp.task('serve', function () {
  browserSync({
      notify: false,
      port: 8000,
      ui: {
        port: 8080
      },
      server: {
        baseDir: 'source',
        routes: {
          '/css': '.tmp/css/',
          '/css-spaces': 'node_modules/css-spaces/dist'
        }
      }
  });

  gulp.watch([
    'source/**/*.html',
    '.tmp/css/*.css'
  ]).on('change', browserSync.reload);

  gulp.watch('source/stylesheets/**/*.scss', ['sass:dev']);
});

// delete dist folder
gulp.task('clean', function () {
  return del(['dist', '.tmp']);
});

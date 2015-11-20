var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');

var REMOVE_LINE_TOKEN = /.*@@gulp-remove-line.*/g;

// build task
gulp.task('default', ['build']);

// start scss watch mode
gulp.task('dev', ['sass:dev', 'serve']);

// create normal and minified versions
gulp.task('build', ['clean', 'sass:build', 'copy:sass']);

// create readable css from scss files
gulp.task('sass:dev', function () {
  return gulp.src('source/stylesheets/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('.tmp/css'))
});

// create minified css files
gulp.task('sass:build', function () {
  return gulp.src('source/stylesheets/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
    .pipe(gulp.dest('dist/stylesheets/css'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(rename(function (path) {
      path.basename += ".min";
      return path;
    }))
    .pipe(gulp.dest('dist/stylesheets/css'))
});

//copy scss files
gulp.task('copy:sass', function () {
  return gulp.src('source/stylesheets/**/*')
    .pipe(replace(REMOVE_LINE_TOKEN, ''))
    .pipe(gulp.dest('dist/stylesheets/scss/'));
});

gulp.task('copy:build', function () {
  var docs = gulp.src('source/docs/**')
    .pipe(gulp.dest('dist/docs/'));
  var css = gulp.src('dist/stylesheets/css/**')
    .pipe(gulp.dest('dist/docs/css'));

  return merge(docs, css);
});

gulp.task('serve', function () {
  browserSync({
    notify: false,
    port: 8000,
    ui: {
      port: 8080
    },
    server: {
      baseDir: 'source/docs',
      routes: {
        '/css': '.tmp/css/'
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
  return del.sync(['dist/**', '.tmp/**']);
});

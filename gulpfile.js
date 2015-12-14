var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');

var REMOVE_LINE_TOKEN = /.*@@gulp-remove-line.*/g;

// build task
gulp.task('default', ['build']);

// start scss watch mode
gulp.task('dev', gulpSequence('dev:sass', 'server'));
gulp.task('serve', ['dev']); //alias

// create normal and minified versions
gulp.task('build', gulpSequence('clean', ['build:sass', 'build:js'], ['copy:module', 'copy:sass', 'copy:docs']));

// create readable css from scss files
gulp.task('dev:sass', function() {
  return gulp.src('source/stylesheets/*.scss')
    .pipe(scsslint())
    .pipe(sass({outputStyle: 'compact'}).on('warning', gutil.log))
    .pipe(gulp.dest('.tmp/css'))
    .pipe(browserSync.stream());
});

// create minified css files
gulp.task('build:sass', function() {
  return gulp.src('source/stylesheets/*.scss')
    .pipe(scsslint())
    .pipe(sass({outputStyle: 'compact'}).on('error', gutil.log))
    .pipe(gulp.dest('dist/stylesheets/css'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', gutil.log))
    .pipe(rename(function(path) {
      path.basename += ".min";
      return path;
    }))
    .pipe(gulp.dest('dist/stylesheets/css'))
});

//copy scss files
gulp.task('copy:sass', function() {
  return gulp.src('source/stylesheets/**/*')
    .pipe(replace(REMOVE_LINE_TOKEN, ''))
    .pipe(replace('../../bower_components', '../../..'))
    .pipe(gulp.dest('dist/stylesheets/'));
});

gulp.task('copy:docs', function() {
  var docs = gulp.src('source/docs/**')
    .pipe(gulp.dest('dist/docs/'));
  var css = gulp.src('dist/stylesheets/css/**')
    .pipe(gulp.dest('dist/docs/css'));

  return merge(docs, css);
});

gulp.task('copy:module', function() {
  var comps = gulp.src('source/components/**/*.scss')
    .pipe(gulp.dest('dist/components/'));
  var module = gulp.src('source/*.*')
    .pipe(gulp.dest('dist/'));

  return merge(comps, module);
});

gulp.task('build:js', function() {
  var precompiledTemplates = gulp.src(['source/**/*.html', '!source/docs/**/*.html'])
    .pipe(templateCache('templateCache.js', {module: 'msm.components.ui'}));

  var componentScripts = gulp.src(['source/components/**/*.module.js','source/components/**/*.js']);

  return merge(precompiledTemplates, componentScripts)
    .pipe(concat('mindsmash-ui.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('server', function() {
  browserSync({
    notify: false,
    port: 8000,
    ui: {
      port: 8001
    },
    file: true,
    server: {
      baseDir: 'source/docs',
      routes: {
        '/css': '.tmp/css/',
        '/bower_components': 'bower_components',
        '/components': 'source/components',
        '/*.js': 'source/'
      }
    }
  });

  gulp.watch([
    '!source/docs/bower_components/',
    'source/docs/*'
  ]).on('change', browserSync.reload);

  gulp.watch(['source/stylesheets/**/*.scss', 'source/components/**/*.scss'],
    ['dev:sass']);
});

// delete dist and .tmp folder
gulp.task('clean', function() {
  return del.sync(['dist/**', '.tmp/**']);
});

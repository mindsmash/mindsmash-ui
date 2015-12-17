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
var wiredep = require('wiredep').stream;

var REMOVE_LINE_TOKEN = /.*@@gulp-remove-line.*/g;

// build task
gulp.task('default', ['build']);

// start scss watch mode
gulp.task('dev', gulpSequence('sass:dev', 'bower:dev', 'server'));
gulp.task('serve', ['dev']); //alias

// create normal and minified versions
gulp.task('build', gulpSequence('clean', ['sass:build', 'build:js', 'bower:build'], ['copy:module', 'copy:sass', 'copy:docs']));

// create readable css from scss files
gulp.task('sass:dev', function() {
  var kit = gulp.src('source/stylesheets/*.scss')
    .pipe(scsslint())
    .pipe(sass({outputStyle: 'compact', precision: 8}).on('warning', gutil.log))
    .pipe(gulp.dest('.tmp/css'))
    .pipe(browserSync.stream());

  var docs = gulp.src('source/docs/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('warning', gutil.log))
    .pipe(gulp.dest('.tmp/css'))
    .pipe(browserSync.stream());

  return merge(kit, docs);
});

// create minified css files
gulp.task('sass:build', function() {
  var kit = gulp.src('source/stylesheets/*.scss')
    .pipe(scsslint())
    .pipe(sass({outputStyle: 'compact'}).on('error', gutil.log))
    .pipe(gulp.dest('dist/stylesheets/css'))
    .pipe(sass({outputStyle: 'compressed'}).on('error', gutil.log))
    .pipe(rename(function(path) {
      path.basename += ".min";
      return path;
    }))
    .pipe(gulp.dest('dist/stylesheets/css'));

  var docs = gulp.src('source/docs/*.scss')
    .pipe(sass({outputStyle: 'compact'}).on('error', gutil.log))
    .pipe(gulp.dest('dist/docs/css'));

  return merge(kit, docs);
});

gulp.task('bower:build', function () {
  gulp.src('source/docs/index.html')
    .pipe(wiredep({
      onError: gutil.log,
      onMainNotFound: gutil.log,
      onFileUpdated: gutil.log
    }))
    .pipe(gulp.dest('dist/docs'));
});

gulp.task('bower:dev', function () {
  gulp.src('source/docs/index.html')
    .pipe(wiredep({
      devDependencies: true,
      onError: gutil.log,
      onMainNotFound: gutil.log,
      onFileUpdated: gutil.log
    }))
    .pipe(gulp.dest('source/docs'));
});

//copy scss files
gulp.task('copy:sass', function() {
  return gulp.src('source/stylesheets/**/*')
    .pipe(replace(REMOVE_LINE_TOKEN, ''))
    .pipe(replace('../../bower_components', '../../..'))
    .pipe(gulp.dest('dist/stylesheets/'));
});

gulp.task('copy:docs', function() {
  var scripts = gulp.src('source/docs/scripts/*.js')
    .pipe(gulp.dest('dist/docs/scripts'));
  var html = gulp.src('source/docs/*.html')
    .pipe(gulp.dest('dist/docs/'));
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
    'source/docs/*',
    'source/components/**/*'
  ]).on('change', browserSync.reload);

  gulp.watch('bower.json',
    ['bower:dev']);

  gulp.watch(['source/stylesheets/**/*.scss', 'source/components/**/*.scss'],
    ['sass:dev']);
});

// delete dist and .tmp folder
gulp.task('clean', function() {
  return del.sync(['dist/**', '.tmp/**']);
});

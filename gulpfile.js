var gulp = require('gulp');
var concat = require('gulp-concat');

var dev = 'src/app/';
var prod = 'dist/app/';

var thirdSassPaths = [
];
/* Mixed */
var ext_replace = require('gulp-ext-replace');
// import concat from 'gulp-concat';
var runSequence = require('run-sequence');

/* CSS */
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnano = require('cssnano');
var clean = require('gulp-clean');
var sass = require('gulp-sass');

/* JS & TS */
var jsuglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

/* Images */
var imagemin = require('gulp-imagemin');

var tsProject = typescript.createProject('tsconfig.json',
{ experimentalDecorators: true });

gulp.task('build-third-js', function () {
  return gulp.src(['node_modules/foundation-sites/dist/**/*.js'])
          .pipe(concat('third.js'))
          .pipe(gulp.dest(prod + 'assets/js'));
});

gulp.task('build-third-css', function () {
  return gulp.src(thirdSassPaths)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('third.css'))
    .pipe(gulp.dest(prod + 'assets/css'));
});

gulp.task('build-css', function () {
  return gulp.src(dev + '**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(postcss([precss, autoprefixer, cssnano]))
      .pipe(sourcemaps.write())
      .pipe(ext_replace('.css'))
      .pipe(gulp.dest(prod));
});

gulp.task('build-ts', function () {
  return gulp.src([dev + '**/*.ts', 'typings/tsd.d.ts'])
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject))
      .pipe(sourcemaps.write())
      .pipe(jsuglify())
      .pipe(gulp.dest(prod));
});

gulp.task('copy-vid', function () {
  return gulp.src([dev + '**/*.mp4', dev + '**/*.webm'])
      .pipe(gulp.dest(prod));
});

gulp.task('build-img', function () {
  return gulp.src([dev + '**/*.jpg', dev + '**/*.png'])
      .pipe(imagemin({
        progressive: true
      }))
      .pipe(gulp.dest(prod));
});

gulp.task('build-html', function () {
  return gulp.src(dev + '**/*.html')
    .pipe(gulp.dest(prod));
});

gulp.task('watch', function () {
  gulp.watch([dev + '**/*.ts',
              dev + '**/*.scss',
              dev + '**/*.html',
              dev + 'img/*'], [
                'build-ts',
                'build-css',
                'build-html',
                'build-img'
              ]);
});

gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
      .pipe(clean());
});

gulp.task('start', (done) => {
  runSequence('develop',
              'build-third-css',
              'build-third-js',
              'copy-vid',
              'watch', function () {
                done();
              });
});

gulp.task('develop', (done) => {
  runSequence(
  'clean',
  'build-ts',
  'build-css',
  'build-html',
  'build-img', () => done());
});

gulp.task('default', [
  'start'
]);

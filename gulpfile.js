/// <binding ProjectOpened='default' />
var gulp = require('gulp');
var gls = require('gulp-live-server');
var concat = require('gulp-concat');
var tslint = require('gulp-tslint');

var dev = 'src/';
var prod = 'dist/';

/* Mixed */
var ext_replace = require('gulp-ext-replace');
var runSequence = require('run-sequence');

/* CSS */
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var cssnano = require('cssnano');
var clean = require('gulp-clean');

/* JS & TS */
var jsuglify = require('gulp-uglify');
var typescript = require('gulp-typescript');

/* Images */
var imagemin = require('gulp-imagemin');

var tsProject = typescript.createProject('tsconfig.json', {
    experimentalDecorators: true
});

/**
 * Copy all required libraries into build directory.
 */
gulp.task('copy-libs', () => {
    return gulp.src([
            'reflect-metadata/**',
            'core-js/**',
            'systemjs/dist/**',
            'jquery/dist/**',
            'foundation-sites/**',
            'foundation-icons/**',
            'nouislider/distribute/**',
            'ng2-translate/**',
            'rxjs/**',
            'zone.js/dist/**',
            '@angular/**'
        ], {
            cwd: "node_modules/**"
        }) /* Glob required here. */
        .pipe(gulp.dest(prod + "/lib"));
});

gulp.task('build-third-js', function () {

});

gulp.task('build-third-css', function () {
    return gulp.src([
            'node_modules/foundation-sites/dist/css/foundation.min.css',
            'node_modules/foundation-icons/foundation-icons.css',
            'node_modules/nouislider/distribute/nouislider.min.css'
        ])
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
        .pipe(jsuglify())
        .pipe(sourcemaps.write('../../' + prod))
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
        dev + '**/*.png',
        dev + '**/*.jpg'
    ], [
        'build-ts',
        'build-css',
        'build-html',
        'build-img'
    ]);
});

gulp.task('clean-all', function () {
    return gulp.src('dist', {
            read: false
        })
        .pipe(clean());
});

gulp.task('clean', function () {
    return gulp.src('dist/app', {
            read: false
        })
        .pipe(clean());
});

gulp.task('start', function () {
    runSequence('develop',
        'serve',
        'watch');
});

gulp.task('develop', function (done) {
    runSequence(
        'clean',
        'build-ts',
        'build-css',
        'build-html',
        function () {
            done();
        });
});

gulp.task('tslint', function () {
    gulp.src([dev + '**/*.ts'])
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report())
        .pipe(typescript(tsProject));
});

gulp.task('build', function (done) {
    runSequence(
        'clean-all',
        'copy-libs',
        'build-third-js',
        'build-third-css',
        'copy-vid',
        'build-ts',
        'build-css',
        'build-html',
        'build-img',
        function () {
            done();
        });
});

gulp.task('open-prod', function () {

});

gulp.task('serve', function () {
    var server = gls.new('server.js');
    server.start();
});

gulp.task('default', [
    'start'
]);

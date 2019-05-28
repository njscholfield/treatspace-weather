var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var cleancss = require('gulp-clean-css');
var rename = require('gulp-rename');
var gzip = require('gulp-gzip');
var notify = require('gulp-notify');
var uglify = require('gulp-terser'); // changed to terser to use ES6

var gzip_options = {
    threshold: '1kb',
    gzipOptions: {
        level: 9
    }
};

/* Styles */
gulp.task('scss', function() {
    return gulp.src([
        'assets/scss/*.scss'
    ])
    .pipe(sass())
    .pipe(gulp.dest('assets/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cleancss())
    .pipe(gulp.dest('assets/css/min'))
    .pipe(gzip(gzip_options))
    .pipe(gulp.dest('assets/gz'))
    .pipe(notify({
        message: 'Styles task complete',
        onLast: 'True'
    }))
});

/* Scripts */
gulp.task('scripts', function() {
    return gulp.src([
        'assets/js/*.js',
        '!assets/js/*.min.js'
    ])
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/min'))
    .pipe(gzip(gzip_options))
    .pipe(gulp.dest('assets/gz'))
    .pipe(notify({
        message: 'Scripts task complete',
        onLast: 'True'
    }))
});

/* Watch files for changes */
gulp.task('watch', function() {
    gulp.watch('assets/scss/*.scss', gulp.series('scss'));
    gulp.watch(['assets/js/*.js', '!assets/js/*.min.js'], gulp.series('scripts'));
});

/* set the default gulp task to run the sass, scripts, and watch tasks in parallel. */
gulp.task('default', gulp.parallel('scss', 'scripts', 'watch'));

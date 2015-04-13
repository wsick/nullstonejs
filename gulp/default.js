var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = function (meta) {
    var tsProject = ts.createProject({
        target: 'ES5',
        out: meta.name + '.js',
        removeComments: true,
        sourceRoot: '../src'
    });

    gulp.task('default', function () {
        return gulp.src(meta.buildfiles)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist'));
    });
};
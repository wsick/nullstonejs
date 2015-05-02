var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    merge = require('merge2'),
    runSequence = require('run-sequence');

module.exports = function (meta) {
    gulp.task('dist-build', function () {
        var tsProject = ts.createProject({
            declarationFiles: true,
            target: 'ES5',
            out: meta.name + '.js',
            removeComments: true,
            sourceRoot: '../src'
        });

        var tsr = gulp.src(meta.buildfiles)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        return merge([
            tsr.dts.pipe(gulp.dest('dist')),
            tsr.js
                .pipe(uglify())
                .pipe(rename(meta.name + '.min.js'))
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest('dist'))
        ]);
    });

    gulp.task('dist', function (callback) {
        runSequence('bump', ['default', 'dist-build'], callback);
    });
    gulp.task('dist-minor', function (callback) {
        runSequence('bump-minor', ['default', 'dist-build'], callback);
    });
    gulp.task('dist-major', function (callback) {
        runSequence('bump-major', ['default', 'dist-build'], callback);
    });
};
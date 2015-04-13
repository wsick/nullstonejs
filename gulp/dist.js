var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    merge = require('merge2'),
    srcs = [
        'typings/*.d.ts',
        'src/_version.ts',
        'src/*.ts',
        'src/**/*.ts'
    ];

module.exports = function (meta) {
    gulp.task('dist-build', function () {
        var tsProject = ts.createProject({
            declarationFiles: true,
            target: 'ES5',
            out: meta.name + '.js',
            removeComments: true,
            sourceRoot: '../src'
        });

        var tsr = gulp.src(srcs)
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

    gulp.task('dist', ['bump', 'dist-build']);
    gulp.task('dist-minor', ['bump-minor', 'dist-build']);
    gulp.task('dist-major', ['bump-major', 'dist-build']);
};
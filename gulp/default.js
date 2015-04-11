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
    var tsProject = ts.createProject({
        declarationFiles: true,
        target: 'ES5',
        out: meta.name + '.js',
        removeComments: true
    });

    gulp.task('default', function () {
        var tsr = gulp.src(srcs)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject));

        return merge([
            tsr.dts.pipe(gulp.dest('dist')),
            tsr.js.pipe(sourcemaps.write())
                .pipe(gulp.dest('dist'))
                .pipe(uglify())
                .pipe(sourcemaps.write())
                .pipe(rename('nullstone.min.js'))
                .pipe(gulp.dest('dist'))
        ]);
    });
};
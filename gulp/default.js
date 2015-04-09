var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    srcs = [
        'typings/*.d.ts',
        'src/_Version.ts',
        'src/*.ts',
        'src/**/*.ts'
    ];

module.exports = function () {
    gulp.task('default', function () {
        gulp.src(srcs)
            .pipe(sourcemaps.init())
            .pipe(ts({
                declarationFiles: true,
                target: 'ES5',
                out: 'nullstone.js',
                removeComments: true
            }))
            .js.pipe(sourcemaps.write())
            .pipe(gulp.dest('dist'));
    });
};
var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = function () {
    gulp.task('test', ['default'], function () {
        var result = gulp.src([
            'typings/*.d.ts',
            'test/**/*.ts',
            '!test/lib/**/*.ts',
            'dist/nullstone.d.ts'
        ])
            .pipe(sourcemaps.init())
            .pipe(ts({
                declarationFiles: false,
                target: 'ES5',
                removeComments: false
            }));

        return result.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('test/.build'));
    });
};

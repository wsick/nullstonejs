var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps');

module.exports = function () {
    gulp.task('stress', ['default'], function () {
        var result = gulp.src([
            'typings/*.d.ts',
            'stress/**/*.ts',
            '!stress/lib/**/*.ts',
            'dist/nullstone.d.ts'
        ])
            .pipe(sourcemaps.init())
            .pipe(ts({
                declarationFiles: false,
                target: 'ES5',
                module: 'amd',
                removeComments: false
            }));

        return result.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('stress/.build'));
    });
};
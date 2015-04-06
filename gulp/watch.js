var gulp = require('gulp');

module.exports = function () {
    gulp.task('watch', ['default'], function () {
        gulp.watch('src/**/*.ts', ['default']);
    });
};
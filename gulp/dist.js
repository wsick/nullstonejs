var gulp = require('gulp');

module.exports = function (meta) {
    gulp.task('dist', ['bump', 'default']);
    gulp.task('dist-minor', ['bump-minor', 'default']);
    gulp.task('dist-major', ['bump-major', 'default']);
};
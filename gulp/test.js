var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    qunit = require('gulp-qunit');

module.exports = function () {
    gulp.task('build-test', function () {
        gulp.src([
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
            }))
            .js.pipe(sourcemaps.write())
            .pipe(gulp.dest('test/.build'));
    });

    gulp.task('test', ['default', 'build-test'], function () {
        return gulp.src('test/tests.html')
            .pipe(qunit());
    });
};
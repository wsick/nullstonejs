var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    qunit = require('gulp-qunit');

module.exports = function (meta) {
    var tsProject = ts.createProject({
        declarationFiles: false,
        target: 'ES5',
        removeComments: false
    });

    gulp.task('test-build', function () {
        return gulp.src([
            'typings/*.d.ts',
            'test/**/*.ts',
            '!test/lib/**/*.ts',
            'dist/' + meta.name + '.d.ts'
        ])
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .js.pipe(sourcemaps.write())
            .pipe(gulp.dest('test/.build'));
    });

    gulp.task('test-run', function () {
        return gulp.src('test/tests.html')
            .pipe(qunit());
    });

    gulp.task('test', ['test-build', 'test-run'], function () {
        gulp.watch(['test/**/*.ts', '!test/lib/**/*.ts'], ['test-build']);
        gulp.watch(['dist/*', 'test/.build/**/*.js'], ['test-run']);
    });
};
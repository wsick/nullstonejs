var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    open = require('gulp-open');

module.exports = function () {
    var tsProject = ts.createProject({
        declarationFiles: false,
        target: 'ES5',
        module: 'amd',
        removeComments: false
    });

    gulp.task('stress-build', function () {
        return gulp.src([
            'typings/*.d.ts',
            'stress/**/*.ts',
            '!stress/lib/**/*.ts',
            'dist/nullstone.d.ts'
        ])
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .js.pipe(sourcemaps.write())
            .pipe(gulp.dest('stress/.build'))
            .pipe(connect.reload());
    });

    gulp.task('stress', ['default', 'stress-build'], function () {
        var options = {
            url: 'http://localhost:8080'
        };
        gulp.src('stress/index.html')
            .pipe(open('', options));

        connect.server({
            livereload: true,
            root: ['stress', 'stress/.build']
        });

        gulp.watch('stress/**/*.ts', ['stress-build']);
    });
};
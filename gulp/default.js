var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps'),
    srcs = [
        'typings/*.d.ts',
        'src/_Version.ts',
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
        gulp.src(srcs)
            .pipe(sourcemaps.init())
            .pipe(ts(tsProject))
            .js.pipe(sourcemaps.write())
            .pipe(gulp.dest('dist'));
    });
};
var gulp = require('gulp'),
    symlink = require('gulp-symlink'),
    merge = require('merge2'),
    path = require('path'),
    testlinks = [
        {src: './lib/qunit', dest: 'qunit'},
        {src: './lib/requirejs', dest: 'requirejs'},
        {src: './lib/requirejs-text', dest: 'requirejs-text'},
        {src: './dist', dest: '{name}/dist'},
        {src: './src', dest: '{name}/src'}
    ],
    stresslinks = [
        {src: './lib/requirejs', dest: 'requirejs'},
        {src: './lib/requirejs-text', dest: 'requirejs-text'},
        {src: './dist', dest: '{name}/dist'},
        {src: './src', dest: '{name}/src'}
    ];

module.exports = function (meta) {
    gulp.task('reset', function () {
        return merge([
            symlinkTestLibs(),
            symlinkStressLibs()
        ]);
    });

    function symlinkTestLibs() {
        var srcs = testlinks.map(function (link) {
            return link.src;
        });
        var dests = testlinks.map(function (link) {
            return path.join('test', 'lib', link.dest.replace('{name}', 'nullstone'));
        });

        return gulp.src(srcs)
            .pipe(symlink.relative(dests, {force: true}));
    }

    function symlinkStressLibs() {
        var srcs = stresslinks.map(function (link) {
            return link.src;
        });
        var dests = stresslinks.map(function (link) {
            return path.join('stress', 'lib', link.dest.replace('{name}', 'nullstone'));
        });

        return gulp.src(srcs)
            .pipe(symlink.relative(dests, {force: true}));
    }
};
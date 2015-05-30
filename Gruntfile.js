var version = require('./build/version'),
    setup = require('./build/setup'),
    path = require('path'),
    connect_livereload = require('connect-livereload');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');

    var meta = {
        name: 'nullstone'
    };
    var ports = {
        stress: 9003,
        livereload: 19003
    };
    var dirs = {
        test: {
            root: 'test',
            build: 'test/.build',
            lib: 'test/lib'
        },
        stress: {
            root: 'stress',
            build: 'stress/.build',
            lib: 'stress/lib'
        }
    };

    function mount(connect, dir) {
        return connect.static(path.resolve(dir));
    }

    grunt.initConfig({
        meta: meta,
        ports: ports,
        dirs: dirs,
        pkg: grunt.file.readJSON('./package.json'),
        clean: {
            bower: ['./lib'],
            test: ['<%= dirs.test.lib %>'],
            stress: ['<%= dirs.stress.lib %>']
        },
        setup: {
            base: {
                cwd: '.'
            }
        },
        symlink: {
            options: {
                overwrite: true
            },
            test: {
                files: [
                    { src: './lib/qunit', dest: '<%= dirs.test.lib %>/qunit' },
                    { src: './lib/requirejs', dest: '<%= dirs.test.lib %>/requirejs' },
                    { src: './lib/requirejs-text', dest: '<%= dirs.test.lib %>/requirejs-text' },
                    { src: './dist', dest: '<%= dirs.test.lib %>/<%= meta.name %>/dist' },
                    { src: './src', dest: '<%= dirs.test.lib %>/<%= meta.name %>/src' }
                ]
            },
            stress: {
                files:[
                    {src: './lib/requirejs', dest: '<%= dirs.stress.lib %>/requirejs'},
                    {src: './lib/requirejs-text', dest: '<%= dirs.stress.lib %>/requirejs-text'},
                    {src: './dist', dest: '<%= dirs.stress.lib %>/<%= meta.name %>/dist'},
                    {src: './src', dest: '<%= dirs.stress.lib %>/<%= meta.name %>/src'}
                ]
            }
        },
        typescript: {
            build: {
                src: [
                    'typings/*.d.ts',
                    './src/_Version.ts',
                    './src/*.ts',
                    './src/**/*.ts'
                ],
                dest: './dist/<%= meta.name %>.js',
                options: {
                    target: 'es5',
                    declaration: true,
                    sourceMap: true
                }
            },
            test: {
                src: [
                    'typings/*.d.ts',
                    '<%= dirs.test.root %>/**/*.ts',
                    '!<%= dirs.test.lib %>/**/*.ts',
                    'dist/nullstone.d.ts'
                ],
                dest: '<%= dirs.test.build %>',
                options: {
                    target: 'es5',
                    rootDir: '<%= dirs.test.root %>',
                    module: 'amd',
                    sourceMap: true
                }
            },
            stress: {
                src: [
                    'typings/*.d.ts',
                    '<%= dirs.stress.root %>/**/*.ts',
                    '!<%= dirs.stress.lib %>/**/*.ts',
                    'dist/nullstone.d.ts'
                ],
                dest: '<%= dirs.stress.build %>',
                options: {
                    target: 'es5',
                    rootDir: '<%= dirs.stress.root %>',
                    module: 'amd',
                    sourceMap: true
                }
            }
        },
        qunit: {
            all: ['<%= dirs.test.root %>/*.html']
        },
        connect: {
            stress: {
                options: {
                    port: ports.stress,
                    base: dirs.stress.root,
                    middleware: function (connect) {
                        return [
                            connect_livereload({port: ports.livereload}),
                            mount(connect, dirs.stress.build),
                            mount(connect, dirs.stress.root)
                        ];
                    }
                }
            }
        },
        open: {
            stress: {
                path: 'http://localhost:<%= ports.stress %>/index.html'
            }
        },
        watch: {
            src: {
                files: [
                    'src/*.ts',
                    'src/**/*.ts'
                ],
                tasks: ['typescript:build']
            },
            stressts: {
                files: [
                    '<%= dirs.stress.root %>/*.ts',
                    '<%= dirs.stress.root %>/**/*.ts',
                    '!<%= dirs.stress.root %>/lib/**/*.ts'
                ],
                tasks: ['typescript:stress']
            },
            stress: {
                files: [
                    '<%= dirs.stress.root %>/tests.json',
                    '<%= dirs.stress.root %>/index.html',
                    '<%= dirs.stress.build %>/**/*.js'
                ],
                options: {
                    livereload: ports.livereload
                }
            }
        },
        version: {
            bump: {
            },
            apply: {
                src: './build/_VersionTemplate._ts',
                dest: './src/_Version.ts'
            }
        },
        uglify: {
            options: {
                sourceMap: function (path) {
                    return path.replace(/(.*).min.js/, "$1.js.map");
                },
                sourceMapIn: 'dist/<%= meta.name %>.js.map',
                sourceMapIncludeSources: true
            },
            dist: {
                src: ['dist/<%= meta.name %>.js'],
                dest: 'dist/<%= meta.name %>.min.js'
            }
        }
    });

    grunt.registerTask('default', ['typescript:build']);
    grunt.registerTask('test', ['typescript:build', 'typescript:test', 'qunit']);
    grunt.registerTask('stress', ['typescript:build', 'typescript:stress', 'connect', 'open', 'watch']);
    setup(grunt);
    version(grunt);
    grunt.registerTask('lib:reset', ['clean', 'setup', 'symlink:test', 'symlink:stress']);
    grunt.registerTask('dist:upbuild', ['version:bump', 'version:apply', 'typescript:build', 'uglify:dist']);
    grunt.registerTask('dist:upminor', ['version:bump:minor', 'version:apply', 'typescript:build', 'uglify:dist']);
    grunt.registerTask('dist:upmajor', ['version:bump:major', 'version:apply', 'typescript:build', 'uglify:dist']);
};
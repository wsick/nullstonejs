var fs = require('fs'),
    meta = {
        name: 'nullstone',
        buildfiles: [
            'typings/*.d.ts',
            'src/_version.ts',
            'src/polyfill/*.ts',
            'src/*.ts',
            'src/**/*.ts'
        ]
    };

fs.readdirSync('./gulp')
    .forEach(function (file) {
        require('./gulp/' + file)(meta);
    });
var fs = require('fs'),
    meta = {
        name: 'nullstone'
    };

fs.readdirSync('./gulp')
    .forEach(function (file) {
        require('./gulp/' + file)(meta);
    });
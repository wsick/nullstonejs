var fs = require('fs');

fs.readdirSync('./gulp')
    .forEach(function (file) {
        require('./gulp/' + file)();
    });
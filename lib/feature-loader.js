var fs = require('fs');

function load(filename, callback) {
    fs.watch(filename, function (event, file) {
        if (event === 'change') {
            callback(null, file);
        }
    });

    return true;
}

module.exports = {
    "load": load
};
var fs = require('fs');

function load (filename, callback) {
    fs.watch(filename, function (event, file) {
        console.log(event);
        callback(null);
    });

    return true;
}

module.exports = {
    "load": load
};
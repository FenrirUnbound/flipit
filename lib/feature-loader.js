var fs = require('fs');

function update(filename, callback) {
    fs.readFile(filename, 'utf8', function (error, data) {
        console.log('error message: ', error);
        console.log('filename:  ', filename);
        console.log('data:  ', data);
        callback(error, JSON.parse(data));
    });
}

function load(filename, callback) {
    update(filename, callback);

    return fs.watch(filename, function (event, file) {
        if (event === 'change') {
            console.log('change');
            update(filename, callback);
        }
    });
}

module.exports = {
    "load": load
};
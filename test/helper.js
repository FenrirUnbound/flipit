var fs = require('fs'),
    path = require('path');

function loadDataFromFile(filename) {
    var dataString = fs.readFileSync(filename, 'utf8');

    return JSON.parse(dataString);
}

function validateHash(expectedHash, actualHash) {
    var count = 0;

    Object.keys(expectedHash).forEach(function (expectedKey) {
        if (expectedHash.hasOwnProperty(expectedKey)) {
            if (actualHash.hasOwnProperty(expectedKey)) {
                count += 1;
            }
        }
    });

    return count;
}

module.exports = {
    validateHash: validateHash,
    loadDataFromFile: loadDataFromFile
};
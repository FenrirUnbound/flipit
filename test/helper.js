var fs = require('fs'),
    path = require('path'),
    TEMPLATE_FEATURE_FILE = path.resolve('test', 'testFeatureFiles', 'templateFeatureFile.json');

function destroyTestFile(filePath) {
    if (filePath !== TEMPLATE_FEATURE_FILE) {
        try {
            fs.unlinkSync(filePath);
        } catch (error) {
            console.error('Cannot delete "' + filePath + '". Possibly does not exist.');
        }
    }
}

function generateTestFile() {
    var desiredFeatureFile = path.resolve('test', 'testFeatureFiles', 'feature0.json'),
        dataString;

    try {
        dataString = fs.readFileSync(TEMPLATE_FEATURE_FILE, 'utf8');
    } catch (readError) {
        console.error('Test template file "' + TEMPLATE_FEATURE_FILE + '" unavailable.');
        return null;
    }

    try {
        fs.writeFileSync(desiredFeatureFile, dataString, 'utf8');
    } catch (writeError) {
        console.error('Cannot generate test feature file "' + desiredFeatureFile + '".');
        return null;
    }

    return desiredFeatureFile;
}

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
    destroyTestFile: destroyTestFile,
    generateTestFile: generateTestFile,
    loadDataFromFile: loadDataFromFile,
    validateHash: validateHash
};
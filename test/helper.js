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
    validateHash: validateHash
};
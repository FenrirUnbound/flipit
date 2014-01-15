var Y = require('yuitest'),
    Assert = Y.Assert,
    path = require('path'),
    fs = require('fs'),
    FEATURE_LOADER_PATH = path.join('..', 'lib', 'feature-loader'),
    TEST_FILE_FOLDER = path.resolve('test', 'testFeatureFiles');

Y.TestRunner.add(new Y.TestCase({
    "name": "Functional Test Feature Loader",

    "_should": {
        "ignore": {
            "test load callback is not called when file rename occurs": true
        }
    },


    "test load callback is called when file update occurs": function () {
        var module = require(FEATURE_LOADER_PATH),
            testFilePath = path.resolve('test', 'testFeatureFiles', 'feature0.json'),
            self = this;

        module.load(testFilePath, function (error) {
            self.resume(function () {
                Assert.isNull(error, 'No errors received from update proc.');
            });
        });

        fs.appendFile(testFilePath, '\n', function (error) {
            Assert.isNull(error, 'No errors received from updating test json file');
        });

        this.wait(5000);
    },

    "test load callback is not called when file rename occurs": function () {
        // SKIP: Due to unstable fs.watch API
        var module = require(FEATURE_LOADER_PATH),
            testFileSource = path.resolve(TEST_FILE_FOLDER, 'feature0.json'),
            testFilePath = path.resolve(TEST_FILE_FOLDER, 'feature1.json'),
            self = this;

        // Copy source
        fs.createReadStream(testFileSource).pipe(fs.createWriteStream(testFilePath));

        module.load(testFilePath, function (error) {
            self.resume(function () {
                Assert.fail("Should not be proc'd.");
            });
        });

        fs.rename(testFilePath, path.resolve(TEST_FILE_FOLDER, 'feature2.json'), function (error) {
            Assert.isNull(error, 'No errors received from updating test json file.');
        });

        self.wait(5000);
    }
}));
var Y = require('yuitest'),
    Assert = Y.Assert,
    path = require('path'),
    fs = require('fs'),
    helper = require('./helper'),
    FEATURE_LOADER_PATH = path.join('..', 'lib', 'feature-loader'),
    TEST_FILE_FOLDER = path.resolve('test', 'testFeatureFiles'),
    TEST_FEATURE_FILE = path.resolve(TEST_FILE_FOLDER, 'feature0.json');

Y.TestRunner.add(new Y.TestCase({
    "name": "Functional Test Feature Loader",

    "_should": {
        "ignore": {
            "test load callback is not called when file rename occurs": true
        }
    },

    "setUp": function () {
        this.module = require(FEATURE_LOADER_PATH);
    },

    "tearDown": function () {
        this.watcher.close();
    },

    "test load data from a file": function () {
        var testData = {
                "testFeature": true,
                "anotherFeatureForTesting": true
            },
            self = this,
            expectedCount = 2;

        self.watcher = self.module.load(TEST_FEATURE_FILE, function (error, data) {
            self.resume(function () {
                Assert.areSame(expectedCount, helper.validateHash(testData, data));
            });
        });

        self.wait(1000);
    },

    "test load callback is called when file update occurs": function () {
        var self = this,
            waitingState = false;

        self.watcher = self.module.load(TEST_FEATURE_FILE, function (error, data) {
            Assert.isNull(error, 'No errors received from update proc.');

            if (waitingState) {
                // Ignore the initial update proc from the first load call

                self.resume(function () {
                    Assert.isNull(error, 'No errors received from update proc.');
                });                
            }
        });

        self.wait(function () {
            waitingState = true;

            fs.appendFile(TEST_FEATURE_FILE, '\n', function (error, data) {
                Assert.isNull(error, 'No errors received from updating test json file');
            })

            self.wait(function () {
                Assert.fail('No callbacks were made.');
            }, 1000);
        }, 1000);
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
            Assert.fail("Should not be proc'd.");
        });

        fs.rename(testFilePath, path.resolve(TEST_FILE_FOLDER, 'feature2.json'), function (error) {
            Assert.isNull(error, 'No errors received from updating test json file.');
        });
        this.wait(1000);
    }
}));
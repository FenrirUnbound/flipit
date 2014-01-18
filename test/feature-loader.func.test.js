var Y = require('yuitest'),
    Assert = Y.Assert,
    path = require('path'),
    fs = require('fs'),
    helper = require('./helper'),
    FEATURE_LOADER_PATH = path.join('..', 'lib', 'feature-loader'),
    TEST_FILE_FOLDER = path.resolve('test', 'testFeatureFiles');

Y.TestRunner.add(new Y.TestCase({
    "name": "Functional Test Feature Loader",

    "_should": {
        "ignore": {
            "test load callback is not called when file rename occurs": true
        }
    },

    "setUp": function () {
        this.module = require(FEATURE_LOADER_PATH);
        this.featureFile = helper.generateTestFile();
    },

    "tearDown": function () {
        helper.destroyTestFile(this.featureFile);
        this.watcher.close();
    },

    "test load data from a file": function () {
        var me = this,
            testData = helper.loadDataFromFile(me.featureFile),
            expectedCount = 3;

        me.watcher = me.module.load(me.featureFile, function (error, data) {
            me.resume(function () {
                Assert.areSame(expectedCount, helper.validateHash(testData, data));
            });
        });

        me.wait(1000);
    },

    "test load callback is called when file update occurs": function () {
        var me = this,
            waitingState = false;

        me.watcher = me.module.load(me.featureFile, function (error, data) {
            Assert.isNull(error, 'No errors received from update proc.');

            if (waitingState) {
                // Ignore the initial update proc from the first load call

                me.resume(function () {
                    Assert.isNull(error, 'No errors received from update proc.');
                });
            }
        });

        me.wait(function () {
            waitingState = true;

            fs.appendFile(me.featureFile, '\n', function (error, data) {
                Assert.isNull(error, 'No errors received from updating test json file');
            });

            me.wait(function () {
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
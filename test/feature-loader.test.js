var Y = require('yuitest'),
    Assert = Y.Assert,
    mockery = require('mockery'),
    path = require('path'),
    FEATURE_LOADER_PATH = path.join('..', 'lib', 'feature-loader');

Y.TestRunner.add(new Y.TestCase({
    "name": "Test Feature Loader",

    "setUp": function () {
        this.module = require(FEATURE_LOADER_PATH);
    },

    "tearDown": function () {
        mockery.deregisterAll();
        mockery.disable();
    },

    "test require the package": function () {
        Assert.isNotUndefined(this.module);
    },

    "validate API": function () {
        var self = this,
            testEndpoints = [
                'load'
            ];

        testEndpoints.forEach(function (endpoint) {
            Assert.isTrue(self.module.hasOwnProperty(endpoint),
                'Endpoint "' + endpoint + '" exists.');
        });
    },

    "test load endpoint": function () {
        var self = this,
            testFilename = './features.json';

        mockery.enable({
            useCleanCache: true
        });
        mockery.registerMock('fs', {
            "watch": function (filename, callback) {
                Assert.areSame(testFilename, filename);
                callback('eventName', filename);
            }
        });

        mockery.registerAllowable(FEATURE_LOADER_PATH);
        this.module = require(FEATURE_LOADER_PATH);

        this.module.load(testFilename, function (err, data) {
            Assert.isNull(err);
        });
    }
}));
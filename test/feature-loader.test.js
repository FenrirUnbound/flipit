var Y = require('yuitest'),
    Assert = Y.Assert,
    mockery = require('mockery'),
    path = require('path'),
    FEATURE_LOADER_PATH = path.join('..', 'lib', 'feature-loader');

function mockFsWatch(eventName, testFilename) {
    return function (filename, callback) {
        Assert.areSame(testFilename, filename);
        callback(eventName, filename);
    };
}

Y.TestRunner.add(new Y.TestCase({
    "name": "Test Feature Loader",

    "setUp": function () {
        this.module = require(FEATURE_LOADER_PATH);
        this.testFilename = './features.json';

        mockery.enable({
            useCleanCache: true
        });
    },

    "tearDown": function () {
        mockery.deregisterAll();
        mockery.disable();
    },

    "test require feature-loader package": function () {
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

    "test load endpoint with update only from change event": function () {
        var self = this;

        mockery.registerMock('fs', {
            "watch": mockFsWatch('change', self.testFilename)
        });

        mockery.registerAllowable(FEATURE_LOADER_PATH);
        this.module = require(FEATURE_LOADER_PATH);

        this.module.load(self.testFilename, function (error, filename) {
            Assert.isNull(error);
            Assert.areSame(self.testFilename, filename);

        });
    },

    "test load endpoint with no update from rename event": function () {
        var self = this;

        mockery.registerMock('fs', {
            "watch": mockFsWatch('rename', self.testFilename)
        });

        mockery.registerAllowable(FEATURE_LOADER_PATH);
        this.module = require(FEATURE_LOADER_PATH);

        this.module.load(self.testFilename, function (error, data) {
            Assert.fail("Callback should not be proc'd from rename event");
        });
    }
}));
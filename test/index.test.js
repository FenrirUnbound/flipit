var Y = require('yuitest'),
    Assert = Y.Assert,
    helper = require('./helper'),
    mockery = require('mockery'),
    path = require('path'),
    FLIPIT_PATH = '../index';

Y.TestRunner.add(new Y.TestCase({
    "name": "Test Index",

    "setUp": function () {
        this.app = require(FLIPIT_PATH);
    },

    "tearDown": function () {
        mockery.deregisterAll();
        mockery.disable();
    },

    "test require index package": function () {
        Assert.isNotUndefined(this.app, 'App is a valid package to import');
    },

    "validate API": function () {
        var self = this,
            testEndpoints = [
                'isEnabled',
                'enable',
                'disable',
                'load'
            ];

        testEndpoints.forEach(function (endpoint) {
            Assert.isTrue(self.app.hasOwnProperty(endpoint),
                'Endpoint "' + endpoint + '" exists.');
            Assert.isFunction(self.app[endpoint],
                'Endpoint "' + endpoint + '" is a valid function');
        });
    },

    "toggle a feature": function () {
        var feature = 'brandSpankingNewFeature';

        Assert.isFalse(this.app.isEnabled(feature),
            'Feature "' + feature + '" is initially disabled.');
        Assert.isTrue(this.app.enable(feature),
            'Feature "' + feature + '" has been enabled.');
        Assert.isTrue(this.app.isEnabled(feature),
            'Feature "' + feature + '" is currently active.');

        Assert.isTrue(this.app.disable(feature),
            'Feature "' + feature + '" has been disabled.');
        Assert.isFalse(this.app.isEnabled(feature),
            'Feature "' + feature + '" is currently inactive.');
    },

    "disable an already disabled feature": function () {
        var feature = 'brandSpankingNewFeature';

        Assert.isFalse(this.app.isEnabled(feature),
            'Feature "' + feature + '" is initially disabled.');
        Assert.isFalse(this.app.disable(feature),
            'Feature "' + feature + '" is already disabled.');
    },

    "loading a feature flag from file": function () {
        var testFilePath = path.resolve('test', 'testFeatureFiles', 'feature0.json'),
            testFeatures = helper.loadDataFromFile(testFilePath),
            me = this;

        mockery.enable({
            useCleanCache: true
        });
        mockery.registerMock('./lib/feature-loader', {
            "load": function (filename, callback) {
                callback(null, testFeatures);
            }
        });
        mockery.registerAllowable(FLIPIT_PATH);
        this.app = require(FLIPIT_PATH);

        // Make sure the current test features are disabled
        Object.keys(testFeatures).forEach(function (feature) {
            if (testFeatures.hasOwnProperty(feature)) {
                Assert.isFalse(me.app.isEnabled(feature),
                    'Feature "' + feature + '" is initially disabled.');
            }
        });

        this.app.load(testFilePath, function () {
            Object.keys(testFeatures).forEach(function (feature) {
                if (testFeatures.hasOwnProperty(feature)) {
                    Assert.areSame(testFeatures[feature], me.app.isEnabled(feature),
                        'Feature "' + feature + '" is properly flagged from a load.');
                }
            });
        });
    }
}));
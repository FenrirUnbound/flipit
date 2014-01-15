var Y = require('yuitest'),
    Assert = Y.Assert;

Y.TestRunner.add(new Y.TestCase({
    "name": "Basic test case",

    "setUp": function () {
        this.app = require('../index');
    },

    "test require the package": function () {
        Assert.isNotUndefined(this.app, 'App is a valid package to import');
    },

    "validate API": function () {
        var self = this,
            testEndpoints = [
                'isActive',
                'activate',
                'deactivate'
            ];

        testEndpoints.forEach(function (endpoint) {
            Assert.isTrue(self.app.hasOwnProperty(endpoint),
                'Endpoint "' + endpoint + '" exists.');
            Assert.isFunction(self.app[endpoint],
                'Endpoint "' + endpoint + '" is a valid function');
        });
    },

    "check isActive endpoint for unavailable features": function () {
        var feature = 'notAnAvailableFeature';

        Assert.isFalse(this.app.isActive(feature));
    },

    "toggle a feature": function () {
        var feature = 'brandSpankingNewFeature';

        Assert.isTrue(this.app.activate(feature),
            'Feature "' + feature + '" has been activated.');
        Assert.isTrue(this.app.isActive(feature),
            'Feature "' + feature + '" is currently active.');

        Assert.isTrue(this.app.deactivate(feature),
            'Feature "' + feature + '" has been deactivated.');
        Assert.isFalse(this.app.isActive(feature),
            'Feature "' + feature + '" is currently inactive.');
    },
}));
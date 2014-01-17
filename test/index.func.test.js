var Y = require('yuitest'),
    Assert = Y.Assert,
    helper = require('./helper'),
    path = require('path'),
    TEST_FEATURE_FILE = path.resolve('test', 'testFeatureFiles', 'feature0.json');

Y.TestRunner.add(new Y.TestCase({
    "name": "Functional Test Index",

    "setUp": function () {
        this.app = require('../index');
    },

    "load a set of feature flags from file": function () {
        var me = this,
            testFeatures = helper.loadDataFromFile(TEST_FEATURE_FILE);

        this.app.load(TEST_FEATURE_FILE, function () {
            me.resume(function () {
                Object.keys(testFeatures).forEach(function (feature) {
                    if (testFeatures.hasOwnProperty(feature)) {
                        Assert.areSame(testFeatures[feature], me.app.isEnabled(feature),
                            'The feature "' + feature + '" is enabled by file loading.');
                    }
                });
            });
        });

        me.wait(1000);
    }
}));
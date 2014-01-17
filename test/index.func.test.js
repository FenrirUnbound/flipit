var Y = require('yuitest'),
    Assert = Y.Assert,
    helper = require('./helper'),
    path = require('path');

Y.TestRunner.add(new Y.TestCase({
    "name": "Functional Test Index",

    "setUp": function () {
        this.app = require('../index');
        this.featureFile = helper.generateTestFile();
    },

    "tearDown": function () {
        helper.destroyTestFile(this.featureFile);
    },

    "load a set of feature flags from file": function () {
        var me = this,
            testFeatures = helper.loadDataFromFile(me.featureFile);

        me.app.load(me.featureFile, function () {
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
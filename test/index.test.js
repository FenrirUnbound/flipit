var Y = require('yuitest'),
    Assert = Y.Assert;

Y.TestRunner.add(new Y.TestCase({
    "name": "Basic test case",

    "test require the package": function () {
        var app = require('../index');

        Assert.isNotUndefined(app);
    }
}));
var async = require('async');
var expect = require('chai').expect;
var fs = require('fs');
var path = require('path');
var sinon = require('sinon');

describe('Functional -- Feature Loader', function describeFuncFeatureLoader() {
    var fileWatcher;
    var main;

    beforeEach(function beforeAll() {
        main = require('../../lib/feature-loader');
    });

    afterEach(function afterAll() {
        if (fileWatcher) {
            fileWatcher.close();
        }

        fileWatcher = null;
        main = null;
    });

    it('loads data from file', function testLoadDataFromFile(done) {
        var testFilepath = path.resolve(__dirname, '../testFeatureFiles/templateFeatureFile.json');
        var testData = require(testFilepath);

        fileWatcher = main.load(testFilepath, function verify(error, data) {
            expect(error).to.be.null;
            expect(data).to.deep.equal({
                testFeature: true,
                anotherFeatureForTesting: true,
                thisShouldBeUnavailable: false
            });
            done();
        });
    });

    describe('File changes', function describeFileChanges() {
        var testFilepath;

        before(function before(done) {
            testFilepath = path.resolve(__dirname, '../testFeatureFiles/testingFeature.json');
            var testData = {
                flagA: true,
                flagB: false
            };

            fs.writeFile(testFilepath, JSON.stringify(testData), done);
        });

        after(function after(done) {
            fs.unlink(testFilepath, done);
        });

        it('updates when file changes', function testFileChange(done) {
            var callback = sinon.stub();
            var testData = {
                flagA: true,
                flagB: true    // flagB will be "updated"
            };

            fileWatcher = main.load(testFilepath, callback);

            async.series([
                function waitSome(next) {
                    setTimeout(next, 10);
                },
                function updateFile(next) {
                    expect(callback).to.have.been.calledOnce;
                    expect(callback).to.have.been.calledWith(null, {
                        flagA: true,
                        flagB: false
                    });

                    fs.writeFile(testFilepath, JSON.stringify(testData), next);
                },
                function waitSomeMore(next) {
                    setTimeout(next, 10);
                },
                function verify(next) {
                    // the change event procs once on an append
                    // the change event procs twice on an overwrite
                    expect(callback).to.have.been.calledThrice;
                    expect(callback).to.have.been.calledWith(null, {
                        flagA: true,
                        flagB: true
                    });
                    next();
                }
            ], done);
        });
    });

});

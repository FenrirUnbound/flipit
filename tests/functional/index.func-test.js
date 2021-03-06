var expect = require('chai').expect;
var fs = require('fs');
var mockery = require('mockery');
var path = require('path');


describe('Functional -- Main', function describeFuncMain() {
    var main;
    var testFilepath;
    var testFileWatcher;

    before(function before() {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
    });

    beforeEach(function beforeAll(done) {
        main = require('../..');

        testFilepath = path.resolve(__dirname, '../testFeatureFiles/testFeatureFile.json');
        var testData = {
            flagA: true,
            flagB: false
        };
        fs.writeFile(testFilepath, JSON.stringify(testData), done);
    });

    afterEach(function afterAll(done) {
        mockery.resetCache();

        if (testFileWatcher) {
            testFileWatcher.close();
        }
        fs.unlink(testFilepath, done);
    });

    after(function after() {
        mockery.disable();
    });

    it('load a set of feature flags from file', function testLoadFromFile(done) {
        expect(main.isEnabled('flagA')).to.be.false;
        expect(main.isEnabled('flagB')).to.be.false;

        testFileWatcher = main.load(testFilepath, function () {
            expect(main.isEnabled('flagA')).to.be.true;
            expect(main.isEnabled('flagB')).to.be.false;
            done();
        });
    });

    it('load a set of features flags from file with no update callback', function testLoadWithoutCallback(done) {
        expect(main.isEnabled('flagA')).to.be.false;
        expect(main.isEnabled('flagB')).to.be.false;

        testFileWatcher = main.load(testFilepath);

        setTimeout(function verify() {
            expect(main.isEnabled('flagA')).to.be.true;
            expect(main.isEnabled('flagB')).to.be.false;
            done();
        }, 10);
    });
});

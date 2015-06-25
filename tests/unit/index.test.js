var chai = require('chai');
var expect = chai.expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Main', function describeMain() {
    var main;

    beforeEach(function beforeAll() {
        main = require('../..');
    });

    it('has the correct API endpoints', function testApi() {
        expect(main).to.include.keys('isEnabled', 'enable', 'disable', 'load');
    });

    it('toggles a feature', function testToggle() {
        var feature = 'someArbitraryFeature';

        expect(main.isEnabled(feature)).to.be.false;
        expect(main.enable(feature)).to.be.true;
        expect(main.isEnabled(feature)).to.be.true;

        expect(main.disable(feature)).to.be.true;
        expect(main.isEnabled(feature)).to.be.false;
    });

    it('can disable an already-disabled feature', function testDisabledFeature() {
        var feature = 'someArbitraryFeature';

        expect(main.isEnabled(feature)).to.be.false;
        expect(main.disable(feature)).to.be.false;
    });

    describe('-- Feature File', function describeFeatureFile() {
        var featureLoader;

        before(function before() {
            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            featureLoader = {
                load: sinon.stub()
            };

            mockery.registerMock('./lib/feature-loader', featureLoader);
            main = require('../..');
        });

        after(function after() {
            mockery.disable();
        });

        it('loads a feature flag from file', function testLoadFromFile(done) {
            var testData = {
                flagA: true,
                flagB: false
            };
            featureLoader.load.yieldsAsync(null, testData);

            expect(main.isEnabled('flagA')).to.be.false;
            expect(main.isEnabled('flagB')).to.be.false;

            main.load('filename', function verify() {
                expect(featureLoader.load).to.have.been.calledWith('filename');

                expect(main.isEnabled('flagA')).to.be.true;
                expect(main.isEnabled('flagB')).to.be.false;

                done();
            });
        });
    });
});

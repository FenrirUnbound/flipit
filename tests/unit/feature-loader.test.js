var chai = require('chai');
var expect = chai.expect;
var mockery = require('mockery');
var sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('Feature Loader', function describeFeatureLoad() {
    var fs;
    var main;

    before(function before() {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });
    });

    beforeEach(function beforeAll() {
        fs = {
            readFile: sinon.stub(),
            watch: sinon.stub()
        };

        mockery.registerMock('fs', fs);
        main = require('../../lib/feature-loader');
    });

    afterEach(function afterAll() {
        mockery.deregisterAll();
        mockery.resetCache();
    });

    after(function after() {
        mockery.disable();
    });

    it('loads a file', function testLoadFile(done) {
        var testFilename = 'someFileName.json';
        fs.readFile.yieldsAsync(null, '{"flag":true}');
        fs.watch.returns({test:'object'});

        var result = main.load(testFilename, function verify(error, data) {
            expect(fs.readFile).to.always.have.been.calledWith(testFilename, 'utf8');
            expect(fs.watch).to.always.have.been.calledWith(testFilename);

            expect(error).to.be.null;
            expect(data).to.deep.equal({
                flag: true
            });
            expect(result).to.deep.equal({
                test: 'object'
            });

            done();
        });
    });

    it('updates from a change event', function testChangeEvent(done) {
        var testFilename = 'abc123.json';
        var callback = sinon.stub();
        fs.readFile.onFirstCall().yieldsAsync(null, '{"flag":false}');
        fs.readFile.onSecondCall().yieldsAsync(null, '{"flag":true}');
        fs.watch.yieldsAsync('change', testFilename);

        main.load(testFilename, callback);

        setTimeout(function verify() {
            expect(callback).to.have.been.calledTwice;
            expect(callback).to.have.been.calledWith(null, {
                flag: false
            });
            expect(callback).to.have.been.calledWith(null, {
                flag: true
            });

            done();
        }, 25);
    });

    it('does not update from rename event', function testRenameEvent(done) {
        var testFilename = 'abc.json';
        fs.readFile.yieldsAsync(null, '{"flag":true}');
        fs.watch.yieldsAsync('rename', testFilename);

        main.load(testFilename, function verify(error, data) {
            expect(fs.readFile).to.have.been.calledOnce;
            expect(fs.readFile).to.always.have.been.calledWith(testFilename, 'utf8');

            expect(error).to.be.null;
            expect(data).to.deep.equal({
                flag: true
            });

            done();
        });
    });
});

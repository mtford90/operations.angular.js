var assert = chai.assert;

describe('digests', function () {

    var Operation, OperationQueue, OperationLogging, $rootScope, $timeout;


    function assertDigestOccurs(callback) {
        inject(function ($q) {
            var deferred = $q.defer();
            deferred.promise.then(callback);
            deferred.resolve();
        });
    }

    function _assertDigestOccurs(callback) {
        return function () { assertDigestOccurs(callback)};
    }

    beforeEach(function () {
        module('test');
        inject(function (_Operation_, _OperationQueue_, _OperationLogging_, _$rootScope_, _$timeout_) {
            Operation = _Operation_;
            OperationQueue = _OperationQueue_;
            OperationLogging = _OperationLogging_;
            $rootScope = _$rootScope_;
            $timeout = _$timeout_;
        });
    });

    describe('operations', function () {
        it('should digest on operation completion', function (done) {
            var op = new Operation();
            op.completion = _assertDigestOccurs(done);
            op.start();
        });

        it('should digest on completion event', function (done) {
            var op = new Operation();
            op.onCompletion(_assertDigestOccurs(done));
            op.start();
        });

        it('should digest on cancel callback', function (done) {
            var work = function (finished) {
                var token = setInterval(function () {
                    if (op.cancelled) {
                        clearTimeout(token);
                        finished();
                    }
                }, 5);
            };
            var op = new Operation(work);
            op.start();
            op.cancel(_assertDigestOccurs(done));
        });
    });

    describe('queues', function () {
        var q;
        beforeEach(function () {
            q = new OperationQueue();
        });

        it('should digest on start', function (done) {
            q.onStart(_assertDigestOccurs(done));
            q.start();

        });

        it('should digest on stop', function (done) {
            q.start();
            q.onStop(_assertDigestOccurs(done));
            q.stop();
        })
    });


});
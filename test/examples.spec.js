var assert = chai.assert;

describe('examples', function () {
    var Operation, OperationQueue;


    beforeEach(function () {
        module('myModule');
        inject(function (_Operation_, _OperationQueue_) {
            Operation = _Operation_;
            OperationQueue = _OperationQueue_;
        });
    });

    it('xyz', function (done) {
        inject(function (MyOperationsService, myQueue) {
            var logOp = MyOperationsService.logOperation();
            for (var i = 0; i < 10; i++) {
                var uselessOp = MyOperationsService.uselessOperation();
                myQueue.addOperation(uselessOp);
                logOp.addDependency(uselessOp);
            }
            logOp.onCompletion(done);
            myQueue.start();
        });
    })

});


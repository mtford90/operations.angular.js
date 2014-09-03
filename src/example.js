angular.module('myModule', ['operations'])

    .factory('myQueue', function (OperationQueue) {
        // Max 2 concurrent operations.
        return new OperationQueue('My Awesome Queue', 2);
    })

    .factory('MyOperationsService', function (Operation) {
        return {
            uselessOperation: function () {
                return new Operation('My Useless Operation', function (done) {
                    var finished = false;
                    var self = this;
                    var interval = setInterval(function () {
                        if (self.cancelled || finished) {
                            clearInterval(interval);
                            if (finished) done();
                        }
                    }, 10);
                    setTimeout(function () {
                        finished = true;
                    }, 100);
                });
            },
            logOperation: function () {
                return new Operation('My Logger Operation', function (done) {
                    console.log('Finished!');
                    done();
                });
            }
        }
    })



;
operations.angular.js
=====================

[operations.js](https://github.com/mtford90/operations.js) is a library for creating, composing, cancelling and queueing asynchronous operations in Javascript and expressing complex dependencies between them.

This is a wrapper around operations.js for angular, ensuring that digests occur after callbacks.

See the original repo for documentation but here's a dumb example that shows how to get started with angular and operations:

```javascript
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
```

And then we can use our services as follows:

```javascript
var logOp = MyOperationsService.logOperation();
for (var i = 0; i < 10; i++) {
	var uselessOp = MyOperationsService.uselessOperation();
	myQueue.addOperation(uselessOp);
	logOp.addDependency(uselessOp);
}
logOp.onCompletion(done);
myQueue.addOperation(logOp);
myQueue.start();
```

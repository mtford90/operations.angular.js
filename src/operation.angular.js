angular.module('test', [])

    // Wrap in safe callbacks.
    .factory('wrap', function ($rootScope) {

        /**
         * $apply if not already in a $digest cycle.
         * We have to do this check as callbacks can either be synchronous
         * or asynchronous depending on
         */
        function safeApply() {
            $rootScope.$$phase || $rootScope.$apply();
        }

        return {
            /**
             * Wrap the invocation of callback properties and perform a safe apply
             * after invocation.
             * @param obj
             * @param property
             */
            callbackProperty: function (obj, property) {
                var oldProperty;
                if (obj[property]) {
                    oldProperty = obj[property];
                }
                var privateProperty = ('_' + property);

                Object.defineProperty(obj, property, {
                    get: function () {
                        return obj[privateProperty];
                    },
                    set: function (c) {
                        obj['_' + property] = function () {
                            c();
                            safeApply();
                        }
                    },
                    configurable: true,
                    enumerable: true
                });
                if (oldProperty) {
                    obj[privateProperty] = oldProperty;
                }
            },
            /**
             * Wrap event callbacks and perform a safe apply after invocation.
             * @param cls
             * @param property
             */
            event: function (cls, property) {
                var old = cls.prototype[property];
                cls.prototype[property] = function (c) {
                    old.call(this, function () {
                        c();
                        safeApply();
                    });
                }
            }
        }
    })

    .factory('Operation', function ($rootScope, wrap) {
        var Operation = op.Operation;
        /**
         * Wrapper around Operation that ensures digests occur on events.
         * @constructor
         */
        function AngularOperation () {
            if (!this) {
                return new (Function.prototype.bind.apply(Operation, arguments));
            }
            Operation.apply(this, arguments);
            wrap.callbackProperty(this, 'completion');
        }

        AngularOperation.prototype = Object.create(Operation.prototype);

        wrap.event(AngularOperation, 'onCompletion');
        wrap.event(AngularOperation, 'cancel');

        return AngularOperation;
    })


    .factory('OperationQueue', function (wrap) {
        var OperationQueue = op.OperationQueue;

        function AngularOperationQueue () {
            if (!this) {
                return new (Function.prototype.bind.apply(OperationQueue, arguments));
            }
            OperationQueue.apply(this, arguments);
        }

        AngularOperationQueue.prototype = Object.create(OperationQueue.prototype);
        wrap.event(AngularOperationQueue, 'onStart');
        wrap.event(AngularOperationQueue, 'onStop');
        return AngularOperationQueue;
    })


    .factory('OperationLogging', function () {
        return op.Logger;
    })


;
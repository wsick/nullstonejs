module nullstone {
    export interface IFulfilledFunc<T, TResult> {
        (value: T): TResult | Promise<TResult>;
    }
    export interface IRejectedFunc<TResult> {
        (reason: any): TResult | Promise<TResult>;
    }
    export interface IResolveFunc<T> {
        (value?: T | Promise<T>): void;
    }
    export interface IRejectFunc {
        (reason?: any): void;
    }

    // Use polyfill for setImmediate for performance gains
    var asap = (typeof setImmediate === 'function' && setImmediate) ||
        function (fn) {
            setTimeout(fn, 1);
        };

    export class Promise<T> {
        private $$state: boolean = null;
        private $$value: any = null;
        private $$deferreds: Deferred<T, any>[] = [];

        constructor(init: (resolve: IResolveFunc<T>, reject: IRejectFunc) => void) {
            if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
            if (typeof init !== 'function') throw new TypeError('not a function');
            doResolve(init, this._resolve, this._reject);
        }

        /**
         * Attaches callbacks for the resolution and/or rejection of the Promise.
         * @param onFulfilled The callback to execute when the Promise is resolved.
         * @param onRejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of which ever callback is executed.
         */
        then<TResult>(onFulfilled?: IFulfilledFunc<T, TResult>, onRejected?: IRejectedFunc<TResult>): Promise<TResult> {
            return new Promise((resolve, reject) => this._handle(new Deferred(onFulfilled, onRejected, resolve, reject)));
        }

        /**
         * Attaches a callback for only the rejection of the Promise.
         * @param onRejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of the callback.
         */
        catch(onRejected?: (reason: any) => T | Promise<T>): Promise<T> {
            return this.then(null, onRejected);
        }

        tap(onFulfilled?: (value: T) => void, onRejected?: (err: any) => void): Promise<T> {
            return new Promise((resolve, reject) => {
                this.then(result => {
                    onFulfilled && onFulfilled(result);
                    resolve(result);
                }, err => {
                    onRejected && onRejected(err);
                    reject(err);
                });
            });
        }

        private _handle<TResult>(deferred: Deferred<T, TResult>) {
            if (this.$$state === null) {
                this.$$deferreds.push(deferred);
                return
            }
            asap(() => {
                var cb = this.$$state ? deferred.onFulfilled : deferred.onRejected;
                if (cb === null) {
                    (this.$$state ? deferred.resolve : deferred.reject)(this.$$value);
                    return;
                }
                var ret;
                try {
                    ret = cb(this.$$value);
                } catch (e) {
                    deferred.reject(e);
                    return;
                }
                deferred.resolve(ret);
            })
        }

        /**
         * Creates a Promise that is resolved with an array of results when all of the provided Promises
         * resolve, or rejected when any Promise is rejected.
         * @param values An array of Promises.
         * @returns A new Promise.
         */
        static all<T>(values: Promise<void>[]): Promise<void>;
        static all<T>(...values: Promise<void>[]): Promise<void>;
        static all<T>(values: (T | Promise<T>)[]): Promise<T[]>;
        static all<T>(...values: (T | Promise<T>)[]): Promise<T[]>;
        static all<T>(): any {
            var args = Array.prototype.slice.call(arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0] : arguments);

            return new Promise((resolve, reject) => {
                if (args.length === 0) return resolve([]);
                var remaining = args.length;

                function res(i, val) {
                    try {
                        if (val && (typeof val === 'object' || typeof val === 'function')) {
                            var then = val.then;
                            if (typeof then === 'function') {
                                then.call(val, function (val) {
                                    res(i, val)
                                }, reject);
                                return;
                            }
                        }
                        args[i] = val;
                        if (--remaining === 0) {
                            resolve(args);
                        }
                    } catch (ex) {
                        reject(ex);
                    }
                }

                for (var i = 0; i < args.length; i++) {
                    res(i, args[i]);
                }
            });
        }

        /**
         * Creates a Promise that is resolved or rejected when any of the provided Promises are resolved
         * or rejected.
         * @param values An array of Promises.
         * @returns A new Promise.
         */
        static race<T>(values: Promise<T>[]): Promise<T> {
            return new Promise((resolve, reject) => {
                for (var i = 0, len = values.length; i < len; i++) {
                    values[i].then(resolve, reject);
                }
            });
        }

        /**
         * Creates a new rejected promise for the provided reason.
         * @param reason The reason the promise was rejected.
         * @returns A new rejected Promise.
         */
        static reject<T>(reason: any): Promise<void>|Promise<T> {
            return new Promise<T>((resolve, reject) => reject(reason));
        }

        /**
         * Creates a new resolved promise for the provided value.
         * @param value A promise.
         * @returns A promise whose internal state matches the provided promise.
         */
        static resolve(): Promise<void>;
        static resolve<T>(value: T | Promise<T>): Promise<T>;
        static resolve<T>(value?: T | Promise<T>): any {
            if (value instanceof Promise)
                return value;
            return new Promise<T>((resolve, reject) => resolve(value));
        }

        private _resolve = (newValue: any) => {
            try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
                if (newValue === (<any>this)) throw new TypeError('A promise cannot be resolved with itself.');
                if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
                    var then = newValue.then;
                    if (typeof then === 'function') {
                        doResolve(then.apply(newValue), this._resolve, this._reject);
                        return;
                    }
                }
                this.$$state = true;
                this.$$value = newValue;
                this._finale();
            } catch (e) {
                this._reject(e);
            }
        };

        private _reject = <TResult>(newValue: TResult) => {
            this.$$state = false;
            this.$$value = newValue;
            this._finale();
        };

        private _finale() {
            for (var i = 0, len = this.$$deferreds.length; i < len; i++) {
                this._handle(this.$$deferreds[i]);
            }
            this.$$deferreds = null;
        }

        private _setImmediateFn(func: (expression: any, ...args: any[]) => number) {
            asap = func;
        }
    }

    class Deferred<T, TResult> {
        public onFulfilled: IFulfilledFunc<T, TResult>;
        public onRejected: IRejectedFunc<TResult>;
        public resolve: IResolveFunc<T>;
        public reject: IRejectFunc;

        constructor(onFulfilled: IFulfilledFunc<T, TResult>, onRejected: IRejectedFunc<TResult>, resolve: IResolveFunc<T>, reject: IRejectFunc) {
            this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
            this.onRejected = typeof onRejected === 'function' ? onRejected : null;
            this.resolve = resolve;
            this.reject = reject;
        }
    }

    function doResolve<T, TResult>(fn: (resolve: IResolveFunc<T>, reject: IRejectFunc) => void, onFulfilled: IFulfilledFunc<T, TResult>, onRejected: IRejectedFunc<TResult>) {
        var done = false;
        try {
            fn(function (value) {
                if (done) return;
                done = true;
                onFulfilled(<T>value);
            }, function (reason) {
                if (done) return;
                done = true;
                onRejected(reason);
            })
        } catch (ex) {
            if (done) return;
            done = true;
            onRejected(ex);
        }
    }
}

(function (global: any) {
    if (typeof global.Promise !== "function") {
        global.Promise = nullstone.Promise;
    }
})(this);
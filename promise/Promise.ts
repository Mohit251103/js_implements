
enum _State {
    PENDING = "pending",
    FULFILLED = "fulfilled",
    REJECTED = "rejected"
}

type TResolver<T> = (value: T) => void
type TRejector<K> = (reason: K) => void
type TExecutor<T, K> = (resolve: TResolver<T>, reject: TRejector<K>) => void
type TThenFunctionHandler<T> = (value: T) => void
type TCatchFunctionHandler<K> = (reason: K) => void
type TPromiseThen<T> = (handlerFn: TThenFunctionHandler<T>) => {}
type TPromiseCatch<K> = (handlerFn: TCatchFunctionHandler<K>) => {}
type TFinallyHandler = () => void
type TPromiseFinally = (handlerFn: TFinallyHandler) => void

class MyPromise<T, K> {
    private _state: _State = _State.PENDING;
    private _successHandlers: TThenFunctionHandler<T>[] = [];
    private _errorHandlers: TCatchFunctionHandler<K>[] = [];
    private _finallyHandler: TFinallyHandler | undefined = undefined;
    private _value: T;
    private _reason: K;

    constructor(executor: TExecutor<T, K>) {
        executor(this._resolverFn.bind(this), this._rejectorFn.bind(this));
    }

    private _resolverFn: TResolver<T> = (value: T) => {
        this._state = _State.FULFILLED;
        this._value = value;
        this._successHandlers.forEach((fn: TThenFunctionHandler<T>) => {
            fn(value);
        })
        if (this._finallyHandler !== undefined) this._finallyHandler();
    }

    private _rejectorFn: TRejector<K> = (reason: K) => {
        this._state = _State.REJECTED;
        this._reason = reason;
        this._errorHandlers.forEach((fn: TCatchFunctionHandler<K>) => {
            fn(reason);
        })
        if (this._finallyHandler !== undefined) this._finallyHandler();
    }

    public then(handlerFn: TThenFunctionHandler<T>) {
        if (this._state === _State.FULFILLED) {
            handlerFn(this._value);
        }
        else {
            this._successHandlers.push(handlerFn);
        }
        return this;
    }

    public catch(handlerFn: TCatchFunctionHandler<K>) {
        if (this._state === _State.REJECTED) {
            handlerFn(this._reason);
        }
        else {
            this._errorHandlers.push(handlerFn);
        }
        return this;
    }

    public finally(handlerFn: TFinallyHandler) {
        if (this._state !== _State.PENDING) {
            handlerFn();
        }
        else {
            this._finallyHandler = handlerFn;
        }
    }

}

const mypromise = new MyPromise((resolve, reject) => {
    resolve("Hello, This is my custom implementation of promise");
    // reject("Rejected");
})

mypromise
    .then((value) => {
        console.log(value);
    })
    .catch((reason) => {
        console.log(reason);
    })
    .finally(() => {
        console.log("hello");
    })





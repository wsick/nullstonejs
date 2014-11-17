module nullstone {
    export interface IAsyncRequest<T> {
        then(success: (result: T) => any, errored: (error: any) => any): IAsyncRequest<T>;
    }
    export interface IAsyncResolution<T> {
        (resolve: (result: T) => any, reject: (error: any) => any);
    }

    export function createAsync <T>(resolution: IAsyncResolution<T>): IAsyncRequest<T> {
        var onSuccess: (result: T)=>any;
        var onError: (error: any)=>any;

        var resolvedResult: any;

        function resolve (result: T) {
            resolvedResult = result;
            onSuccess && onSuccess(result);
        }

        var resolvedError: any;

        function reject (error: any) {
            resolvedError = error;
            onError && onError(error);
        }

        resolution(resolve, reject);

        var req = <IAsyncRequest<T>>{
            then: function (success: (result: T) => any, errored: (error: any) => any): IAsyncRequest<T> {
                onSuccess = success;
                onError = errored;
                if (resolvedResult !== undefined)
                    onSuccess && onSuccess(resolvedResult);
                else if (resolvedError !== undefined)
                    onError && onError(resolvedError);
                return req;
            }
        };
        return req;
    }
}
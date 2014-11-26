module nullstone {
    interface ILibraryHash {
        [id:string]: ILibrary;
    }
    export interface ILibraryResolver extends ITypeResolver {
        loadTypeAsync(uri: string, name: string): async.IAsyncRequest<any>;
        resolve(uri: string): ILibrary;
    }

    //NOTE:
    //  Library Uri syntax
    //      http://...
    //      lib://<library>[/<namespace>]
    //      <dir>
    export class LibraryResolver implements ILibraryResolver {
        private $$libs: ILibraryHash = {};

        dirResolver = new DirResolver();

        createLibrary (uri: string): ILibrary {
            return new Library(uri);
        }

        loadTypeAsync (uri: string, name: string): async.IAsyncRequest<any> {
            var lib = this.resolve(uri);
            if (!lib)
                return this.dirResolver.loadAsync(uri, name);
            return async.create((resolve, reject) => {
                lib.loadAsync()
                    .then((lib) => {
                        var oresolve = {isPrimitive: false, type: undefined};
                        if (lib.resolveType(null, name, oresolve))
                            resolve(oresolve.type);
                        else
                            resolve(null);
                    }, reject);
            });
        }

        resolve (uri: string): ILibrary {
            var libUri = new Uri(uri);
            var scheme = libUri.scheme;
            if (!scheme)
                return null;

            var libName = (scheme === "lib") ? libUri.host : uri;
            var lib = this.$$libs[libName];
            if (!lib)
                lib = this.$$libs[libName] = this.createLibrary(libName);
            return lib;
        }

        resolveType (uri: string, name: string, /* out */oresolve: IOutType): boolean {
            var libUri = new Uri(uri);
            var scheme = libUri.scheme;
            if (!scheme)
                return this.dirResolver.resolveType(uri, name, oresolve);

            var libName = (scheme === "lib") ? libUri.host : uri;
            var modName = (scheme === "lib") ? libUri.absolutePath : "";
            var lib = this.$$libs[libName];
            if (!lib)
                lib = this.$$libs[libName] = this.createLibrary(libName);
            return lib.resolveType(modName, name, oresolve);
        }
    }
}
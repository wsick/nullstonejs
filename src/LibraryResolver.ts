module nullstone {
    interface ILibraryHash {
        [id:string]: ILibrary;
    }
    export interface ILibraryResolver extends ITypeResolver {
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
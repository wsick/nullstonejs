module nullstone {
    export interface ILibraryResolver {
        resolve(uri: string): ILibrary;
    }
    export class LibraryResolver implements ILibraryResolver {
        resolve (uri: string): ILibrary {
            return Library.get(uri)
                || Library.register(uri, 'lib/' + uri + '/' + uri);
        }
    }
}
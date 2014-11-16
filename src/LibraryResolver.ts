module nullstone {
    export interface ILibraryResolver {
        resolve(uri: string): ILibrary;
    }
    export class LibraryResolver implements ILibraryResolver {
        resolve (uri: string): ILibrary {
            //TODO: Implement
            return null;
        }
    }
}
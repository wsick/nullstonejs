module nullstone {
    export interface ILibraryLoader {
        resolve(uri: string): ILibrary;
    }
    export class LibraryLoader implements ILibraryLoader {
        resolve (uri: string): ILibrary {
            //TODO: Implement
            return null;
        }
    }
}
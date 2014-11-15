module nullstone {
    export interface ILibrary {
        resolve(uri: string, name: string, /* out */oresolve: IOutType): boolean;
    }
    export class Library implements ILibrary {
        resolve (uri: string, name: string, /* out */oresolve: IOutType): boolean {
            //TODO: Implement
            return false;
        }
    }
}
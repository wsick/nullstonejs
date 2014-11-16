module nullstone {
    export interface IDirTypeResolver {
        resolve(moduleName: string, name: string, /* out */oresolve: IOutType): boolean;
    }
    export class DirTypeResolver implements IDirTypeResolver {
        resolve (moduleName: string, name: string, /* out */oresolve: IOutType): boolean {
            return require(moduleName + '/' + name);
        }
    }
}
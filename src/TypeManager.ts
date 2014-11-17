/// <reference path="Uri" />

module nullstone {
    export interface IOutType {
        type: any;
        isPrimitive: boolean;
    }
    // TODO: Primitives
    // SIMPLES["Color"] = true;
    // SIMPLES["FontFamily"] = true;

    export interface ITypeManager {
        resolveType(uri: string, name: string, /* out */oresolve: IOutType): boolean;
        add (uri: string, name: string, type: any): ITypeManager;
        addPrimitive (uri: string, name: string, type: any): ITypeManager;
        addEnum (uri: string, name: string, enu: any): ITypeManager;
    }
    export class TypeManager implements ITypeManager {
        libResolver: ILibraryResolver = new LibraryResolver();

        constructor (public defaultUri: string, public xUri: string) {
            this.libResolver.resolve(defaultUri)
                .add("Array", Array);

            this.libResolver.resolve(xUri)
                .addPrimitive("String", String)
                .addPrimitive("Number", Number)
                .addPrimitive("Double", Number)
                .addPrimitive("Date", Date)
                .addPrimitive("RegExp", RegExp)
                .addPrimitive("Boolean", Boolean)
                .addPrimitive("Uri", Uri);
        }

        resolveType (uri: string, name: string, /* out */oresolve: IOutType): boolean {
            oresolve.isPrimitive = false;
            oresolve.type = undefined;
            return this.libResolver.resolveType(uri, name, oresolve);
        }

        add (uri: string, name: string, type: any): ITypeManager {
            var lib = this.libResolver.resolve(uri);
            if (lib)
                lib.add(name, type);
            return this;
        }

        addPrimitive (uri: string, name: string, type: any): ITypeManager {
            var lib = this.libResolver.resolve(uri);
            if (lib)
                lib.addPrimitive(name, type);
            return this;
        }

        addEnum (uri: string, name: string, enu: any): ITypeManager {
            var lib = this.libResolver.resolve(uri);
            if (lib)
                lib.addEnum(name, enu);
            return this;
        }
    }
}
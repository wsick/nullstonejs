module nullstone {
    export interface IOutType {
        type: any;
        isPrimitive: boolean;
    }
    // TODO: Primitives
    // SIMPLES["Color"] = true;
    // SIMPLES["FontFamily"] = true;

    //NOTE:
    //  Library Uri syntax
    //      http://...
    //      lib://<library>[/<namespace>]

    export interface ITypeResolver {
        resolve(uri: string, name: string, /* out */oresolve: IOutType): boolean;
    }
    export class TypeResolver implements ITypeResolver {
        private $$primtypes: any = {};
        private $$systypes: any = {};
        private $$ns: any = {};

        loader: ILibraryLoader = new LibraryLoader();

        constructor (public defaultUri: string, public primitiveUri: string) {
            this.addPrimitive("String", String)
                .addPrimitive("Number", Number)
                .addPrimitive("Double", Number)
                .addPrimitive("Date", Date)
                .addPrimitive("RegExp", RegExp)
                .addPrimitive("Boolean", Boolean)
                .addSystem("Array", Array);
        }

        addPrimitive (name: string, type: any): TypeResolver {
            this.$$primtypes[name] = type;
            return this;
        }

        addSystem (name: string, type: any): TypeResolver {
            this.$$systypes[name] = type;
            return this;
        }

        add (uri: string, name: string, type: any): TypeResolver {
            var ns = this.$$ns[uri];
            if (!ns)
                ns = this.$$ns[ns] || {};
            ns[name] = type;
            return this;
        }

        resolve (uri: string, name: string, /* out */oresolve: IOutType): boolean {
            if (uri === this.primitiveUri) {
                oresolve.isPrimitive = true;
                if ((oresolve.type = this.$$primtypes[name]) !== undefined)
                    return true;
            }

            oresolve.isPrimitive = false;
            if (uri === this.defaultUri) {
                if ((oresolve.type = this.$$systypes[name]) !== undefined)
                    return true;
            }

            var ns = this.$$ns[uri];
            if (ns) {
                if ((oresolve.type = ns[name]) !== undefined)
                    return true;
            }

            if (uri.indexOf("lib://") !== 0) {
                var loader = this.loader;
                if (loader) {
                    var libName = uri.substr(6);
                    var moduleName = "";
                    var ind = libName.indexOf('/');
                    if (ind > -1) {
                        moduleName = libName.substr(ind + 1);
                        libName = libName.substr(0, ind);
                    }
                    var lib = loader.resolve(libName);
                    if (lib) {
                        if (lib.resolve(moduleName, name, oresolve))
                            return true;
                    }
                }
            }

            oresolve.type = undefined;
            return false;
        }
    }
}
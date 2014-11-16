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
    //      <dir>

    export interface ITypeResolver {
        resolve(uri: string, name: string, /* out */oresolve: IOutType): boolean;
    }
    export class TypeResolver implements ITypeResolver {
        private $$primtypes: any = {};
        private $$systypes: any = {};
        private $$ns: any = {};

        libResolver: ILibraryResolver = new LibraryResolver();
        dirTypeResolver: IDirTypeResolver = new DirTypeResolver();

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
            oresolve.type = undefined;
            if (uri.indexOf("http://") === 0)
                return this.$$resolveUrlType(uri, name, oresolve);
            if (uri.indexOf("lib://") === 0)
                return this.$$resolveLibType(uri, name, oresolve);
            return this.$$resolveDirType(uri, name, oresolve);
        }

        private $$resolveUrlType (uri: string, name: string, /* out */oresolve: IOutType): boolean {
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
            return false;
        }

        private $$resolveLibType (uri: string, name: string, /* out */oresolve: IOutType): boolean {
            var libResolver = this.libResolver;
            if (!libResolver)
                return false;
            var libName = uri.substr(6);
            var moduleName = "";
            var ind = libName.indexOf('/');
            if (ind > -1) {
                moduleName = libName.substr(ind + 1);
                libName = libName.substr(0, ind);
            }
            var lib = libResolver.resolve(libName);
            return !!lib && lib.resolve(moduleName, name, oresolve);
        }

        private $$resolveDirType (uri: string, name: string, /* out */oresolve: IOutType): boolean {
            var resolver = this.dirTypeResolver;
            return !!resolver && resolver.resolve(uri, name, oresolve);
        }
    }
}
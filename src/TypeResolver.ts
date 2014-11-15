module nullstone {
    var SIMPLES = [];
    SIMPLES["Color"] = true;
    SIMPLES["FontFamily"] = true;

    export interface ITypeResolver {
        resolve(uri: string, name: string): any;
    }
    export class TypeResolver implements ITypeResolver {
        private $$systypes: any = {};
        private $$ns: any = {};

        constructor(public defaultUri: string) {
            this.addSystem("String", String)
                .addSystem("Number", Number)
                .addSystem("Date", Date)
                .addSystem("RegExp", RegExp)
                .addSystem("Array", Array)
                .addSystem("Boolean", Boolean)
                .addSystem("Double", Number);
        }

        addSystem(name: string, type: any): TypeResolver {
            this.$$systypes[name] = type;
            return this;
        }

        add(uri: string, name: string, type: any): TypeResolver {
            var ns = this.$$ns[uri];
            if (!ns)
                ns = this.$$ns[ns] || {};
            ns[name] = type;
            return this;
        }

        resolve(uri: string, name: string): any {
            if (uri === this.defaultUri) {
                var type = this.$$systypes[name];
                if (type !== undefined)
                    return type;
            }

            var ns = this.$$ns[uri];
            if (ns) {
                var type = ns[name];
                if (type !== undefined)
                    return type;
            }



            var t: any;
            var xarr = xmlNamespaces[uri];
            if (xarr)
                t = xarr[name];
            t = t || Library.TryGetClass(uri, name) || tryGetRequireClass(uri, name);
            if (t)
                return {IsSystem: isSystem, IsPrimitive: false, IsSimple: isSimple, IsEnum: t.$$enum === true, Type: t};
            return undefined;
        }
    }
}
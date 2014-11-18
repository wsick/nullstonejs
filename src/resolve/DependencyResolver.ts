module nullstone.resolve {
    export interface IDependencyResolver {
        add(uri: string, name: string): boolean;
        resolve(): async.IAsyncRequest<any>;
    }
    export class DependencyResolver implements IDependencyResolver {
        private $$uris: string[] = [];
        private $$names: string[] = [];
        private $$resolving: string[] = [];

        constructor (public typeManager: ITypeManager) {
        }

        add (uri: string, name: string): boolean {
            var uris = this.$$uris;
            var names = this.$$names;
            var ind = uris.indexOf(uri);
            if (ind > -1 && names[ind] === name)
                return false;
            if (this.$$resolving.indexOf(uri + "/" + name) > -1)
                return false;
            uris.push(uri);
            names.push(name);
            return true;
        }

        resolve (): async.IAsyncRequest<any> {
            var as: async.IAsyncRequest<any>[] = [];
            for (var i = 0, uris = this.$$uris, names = this.$$names, tm = this.typeManager, resolving = this.$$resolving; i < uris.length; i++) {
                var uri = uris[i];
                var name = names[i];
                resolving.push(uri + "/" + name);
                as.push(tm.loadTypeAsync(uri, name));
            }
            return async.many(as);
        }
    }
}
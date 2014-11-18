module nullstone.xaml {
    var W3URI = "http://www.w3.org/2000/xmlns/";
    export interface IXamlDependencyResolver extends resolve.IDependencyResolver {
        collect(el: Element);
    }
    export class XamlDependencyResolver extends resolve.DependencyResolver implements IXamlDependencyResolver {
        constructor (typeManager: ITypeManager) {
            super(typeManager);
        }

        collect (el: Element) {
            var parser = new sax.xaml.Parser()
                .onResolveType((uri, name) => {
                    this.add(uri, name);
                    return Object;
                })
                .parse(el);
        }
    }
}
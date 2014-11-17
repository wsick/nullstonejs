declare module nullstone {
    var version: string;
}
declare module nullstone {
    interface IDirTypeResolver {
        resolve(moduleName: string, name: string, oresolve: IOutType): boolean;
    }
    class DirTypeResolver implements IDirTypeResolver {
        public resolve(moduleName: string, name: string, oresolve: IOutType): boolean;
    }
}
declare module nullstone {
    class Enum {
        public Object: any;
        constructor(Object: any);
    }
}
declare module nullstone {
    interface ILibrary {
        rootModule: any;
        loadAsync(onLoaded: (rootModule: any) => any): any;
        resolveType(moduleName: string, name: string, oresolve: IOutType): boolean;
    }
    class Library implements ILibrary {
        private $$libpath;
        private $$module;
        public rootModule : any;
        public loadAsync(onLoaded?: (rootModule: any) => any): void;
        public resolveType(moduleName: string, name: string, oresolve: IOutType): boolean;
        static register(uri: string, modulePath: string): ILibrary;
        static get(uri: string): ILibrary;
    }
}
declare module nullstone {
    interface ILibraryResolver {
        resolve(uri: string): ILibrary;
    }
    class LibraryResolver implements ILibraryResolver {
        public resolve(uri: string): ILibrary;
    }
}
declare module nullstone {
    interface IOutType {
        type: any;
        isPrimitive: boolean;
    }
    interface ITypeResolver {
        resolve(uri: string, name: string, oresolve: IOutType): boolean;
    }
    class TypeResolver implements ITypeResolver {
        public defaultUri: string;
        public primitiveUri: string;
        private $$primtypes;
        private $$systypes;
        private $$ns;
        public libResolver: ILibraryResolver;
        public dirTypeResolver: IDirTypeResolver;
        constructor(defaultUri: string, primitiveUri: string);
        public addPrimitive(name: string, type: any): TypeResolver;
        public addSystem(name: string, type: any): TypeResolver;
        public add(uri: string, name: string, type: any): TypeResolver;
        public resolve(uri: string, name: string, oresolve: IOutType): boolean;
        private $$resolveUrlType(uri, name, oresolve);
        private $$resolveLibType(uri, name, oresolve);
        private $$resolveDirType(uri, name, oresolve);
    }
}
declare module nullstone {
    function Annotation(type: Function, name: string, value: any, forbidMultiple?: boolean): void;
    function GetAnnotations(type: Function, name: string): any[];
    interface ITypedAnnotation<T> {
        (type: Function, ...values: T[]): any;
        Get(type: Function): T[];
    }
    function CreateTypedAnnotation<T>(name: string): ITypedAnnotation<T>;
}
declare module nullstone {
    function ConvertAnyToType(val: any, type: Function): any;
    function RegisterTypeConverter(type: Function, converter: (val: any) => any): void;
    function RegisterEnumConverter(e: any, converter: (val: any) => any): void;
}

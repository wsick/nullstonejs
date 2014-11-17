declare module nullstone {
    var version: string;
}
declare module nullstone {
    class DirResolver implements ITypeResolver {
        public resolveType(moduleName: string, name: string, oresolve: IOutType): boolean;
    }
}
declare module nullstone {
    class Enum {
        public Object: any;
        constructor(Object: any);
    }
}
declare module nullstone {
    interface ITypeResolver {
        resolveType(moduleName: string, name: string, oresolve: IOutType): boolean;
    }
}
declare module nullstone {
    interface IInterfaceDeclaration<T> {
        name: string;
        is(o: any): boolean;
        as(o: any): T;
    }
    class Interface<T> implements IInterfaceDeclaration<T> {
        public name: string;
        constructor(name: string);
        public is(o: any): boolean;
        public as(o: any): T;
    }
}
declare module nullstone {
    interface ILibrary {
        uri: string;
        rootModule: any;
        loadAsync(onLoaded: (rootModule: any) => any): any;
        resolveType(moduleName: string, name: string, oresolve: IOutType): boolean;
        add(name: string, type: any): ILibrary;
        addPrimitive(name: string, type: any): ILibrary;
        addEnum(name: string, enu: any): ILibrary;
    }
    class Library implements ILibrary {
        private $$libpath;
        private $$module;
        private $$primtypes;
        private $$types;
        constructor(uri: string);
        public uri: string;
        public rootModule : any;
        public loadAsync(onLoaded?: (rootModule: any) => any): void;
        public resolveType(moduleName: string, name: string, oresolve: IOutType): boolean;
        public add(name: string, type: any): ILibrary;
        public addPrimitive(name: string, type: any): ILibrary;
        public addEnum(name: string, enu: any): ILibrary;
    }
}
declare module nullstone {
    interface ILibraryResolver extends ITypeResolver {
        resolve(uri: string): ILibrary;
    }
    class LibraryResolver implements ILibraryResolver {
        private $$libs;
        public dirResolver: DirResolver;
        public resolve(uri: string): ILibrary;
        public resolveType(uri: string, name: string, oresolve: IOutType): boolean;
    }
}
declare module nullstone {
    function getPropertyDescriptor(obj: any, name: string): PropertyDescriptor;
    function hasProperty(obj: any, name: string): boolean;
}
declare module nullstone {
    interface IPropertyInfo {
        GetValue(obj: any): any;
        SetValue(obj: any, value: any): any;
    }
    class PropertyInfo implements IPropertyInfo {
        private $$getFunc;
        private $$setFunc;
        public GetValue(obj: any): any;
        public SetValue(obj: any, value: any): any;
        static find(typeOrObj: any, name: string): IPropertyInfo;
    }
}
declare module nullstone {
    function getTypeName(type: Function): string;
    function getTypeParent(type: Function): Function;
    function addTypeInterfaces(type: Function, ...interfaces: IInterfaceDeclaration<any>[]): void;
}
declare module nullstone {
    interface IOutType {
        type: any;
        isPrimitive: boolean;
    }
    interface ITypeManager {
        resolveType(uri: string, name: string, oresolve: IOutType): boolean;
    }
    class TypeManager implements ITypeManager {
        public defaultUri: string;
        public xUri: string;
        public libResolver: ILibraryResolver;
        constructor(defaultUri: string, xUri: string);
        public resolveType(uri: string, name: string, oresolve: IOutType): boolean;
    }
}
declare module nullstone {
    class Uri {
        private $$originalString;
        constructor(uri?: string);
        public host : string;
        public absolutePath : string;
        public scheme : string;
        public toString(): string;
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
    function convertAnyToType(val: any, type: Function): any;
    function registerTypeConverter(type: Function, converter: (val: any) => any): void;
    function registerEnumConverter(e: any, converter: (val: any) => any): void;
}

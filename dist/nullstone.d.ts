declare module nullstone {
    var version: string;
}
declare module nullstone {
    class Enum {
        public Object: any;
        constructor(Object: any);
    }
}
declare module nullstone {
    interface ILibrary {
        resolve(uri: string, name: string, oresolve: IOutType): boolean;
    }
    class Library implements ILibrary {
        public resolve(uri: string, name: string, oresolve: IOutType): boolean;
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
        constructor(defaultUri: string, primitiveUri: string);
        public addPrimitive(name: string, type: any): TypeResolver;
        public addSystem(name: string, type: any): TypeResolver;
        public add(uri: string, name: string, type: any): TypeResolver;
        public resolve(uri: string, name: string, oresolve: IOutType): boolean;
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

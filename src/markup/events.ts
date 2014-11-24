module nullstone.markup.events {
    export interface IResolveType {
        (xmlns: string, name: string): IOutType;
    }
    export interface IResolveObject {
        (type: any): any;
    }
    export interface IResolvePrimitive {
        (type: any, text: string): any;
    }
    export interface IResolveResources {
        (owner: any, ownerType: any): any;
    }
    export interface IBranchSkip<T> {
        (root: T, obj: any);
    }
    export interface IObject {
        (obj: any);
    }
    export interface IObjectEnd {
        (obj: any, prev: any);
    }
    export interface IText {
        (text: string);
    }
    export interface IName {
        (name: string);
    }
    export interface IKey {
        (key: string);
    }
    export interface IPropertyStart {
        (ownerType: any, propName: string);
    }
    export interface IPropertyEnd {
        (ownerType: any, propName: string);
    }
    export interface IResumableError {
        (e: Error): boolean;
    }
    export interface IError {
        (e: Error);
    }
}

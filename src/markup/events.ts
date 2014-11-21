module nullstone.markup.events {
    export interface IResolveType {
        (xmlns: string, name: string): any;
    }
    export interface IResolveObject {
        (type: any): any;
    }
    export interface IObject {
        (obj: any);
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
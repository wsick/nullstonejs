module nullstone.markup {
    export interface IMarkupExtension {
        init(val: string);
        transmute?(os: any[]): any;
    }
}
/// <reference path="Interface" />

module nullstone {
    export interface ICollection<T> {
        GetValueAt(index: number): T;
        SetValueAt(index: number, value: T);
        Insert(index: number, value: T);
    }
    export var ICollection_ = new Interface("ICollection");
    ICollection_.is = function (o: any): boolean {
        if (!o)
            return false;
        return typeof o.GetValueAt === "function" && typeof o.SetValueAt === "function";
    };
}
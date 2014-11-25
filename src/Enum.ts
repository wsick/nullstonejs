module nullstone {
    export class Enum {
        constructor (public Object: any) {
        }

        static fromString<T>(enuType: any, val: string, fallback?: T) {
            var obj = enuType[val];
            return (obj == null) ? (fallback || 0) : obj;
        }
    }
}
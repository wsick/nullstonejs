module nullstone {
    export class AggregateError {
        errors: any[];

        constructor (errors: any[]) {
            this.errors = errors.filter(e => !!e);
            Object.freeze(this);
        }

        flatten (): any[] {
            var flat: any[] = [];
            for (var i = 0, errs = this.errors; i < errs.length; i++) {
                var err = errs[i];
                if (err instanceof AggregateError) {
                    flat = flat.concat((<AggregateError>err).flatten());
                } else {
                    flat.push(err);
                }
            }
            return flat;
        }
    }
}
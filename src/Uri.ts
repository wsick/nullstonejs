/// <reference path="conversion" />

module nullstone {
    export enum UriKind {
        RelativeOrAbsolute = 0,
        Absolute = 1,
        Relative = 2
    }
    export class Uri {
        private $$originalString: string;
        private $$kind: UriKind;

        constructor (uri: Uri);
        constructor (uri: string, kind?: UriKind);
        constructor (baseUri: Uri, relativeUri: string);
        constructor (baseUri: Uri, relativeUri: Uri);
        constructor (uri: string|Uri, kindOrRel?: UriKind|Uri|string) {
            if (typeof uri === "string") {
                this.$$originalString = uri;
                this.$$kind = (<UriKind>kindOrRel) || UriKind.RelativeOrAbsolute;
            } else if (uri instanceof Uri) {
                if (typeof kindOrRel === "string") {
                    if (uri.kind === UriKind.Relative)
                        throw new Error("Base Uri cannot be relative when creating new relative Uri.");
                    this.$$originalString = createRelative(uri, kindOrRel);
                    this.$$kind = UriKind.RelativeOrAbsolute;
                } else if (kindOrRel instanceof Uri) {
                    if (uri.kind === UriKind.Relative)
                        throw new Error("Base Uri cannot be relative when creating new relative Uri.");
                    this.$$originalString = createRelative(uri, kindOrRel.originalString);
                    this.$$kind = UriKind.RelativeOrAbsolute;
                } else {
                    this.$$originalString = (<Uri>uri).$$originalString;
                    this.$$kind = (<Uri>uri).$$kind;
                }
            }
        }

        get kind (): UriKind {
            return this.$$kind;
        }

        get host (): string {
            var s = this.$$originalString;
            var ind = Math.max(3, s.indexOf("://") + 3);
            var end = s.indexOf("/", ind);
            //TODO: Strip port
            return (end < 0) ? s.substr(ind) : s.substr(ind, end - ind);
        }

        get absolutePath (): string {
            var s = this.$$originalString;
            var fstart = s.indexOf("#");
            if (fstart > -1)
                s = s.substr(0, fstart);
            var ind = Math.max(3, s.indexOf("://") + 3);
            var start = s.indexOf("/", ind);
            if (start < 0 || start < ind)
                return "/";
            var qstart = s.indexOf("?", start);
            if (qstart < 0 || qstart < start)
                return s.substr(start);
            return s.substr(start, qstart - start);
        }

        get scheme (): string {
            var s = this.$$originalString;
            var ind = s.indexOf("://");
            if (ind < 0)
                return null;
            return s.substr(0, ind);
        }

        get fragment (): string {
            var s = this.$$originalString;
            var ind = s.indexOf("#");
            if (ind < 0)
                return "";
            return s.substr(ind);
        }

        get originalString (): string {
            return this.$$originalString.toString();
        }

        get isAbsoluteUri(): boolean {
            return !!this.scheme && !!this.host
        }

        toString (): string {
            return this.$$originalString.toString();
        }

        equals (other: Uri): boolean {
            return this.$$originalString === other.$$originalString;
        }

        static isNullOrEmpty (uri: Uri): boolean {
            if (uri == null)
                return true;
            return !uri.$$originalString;
        }
    }
    registerTypeConverter(Uri, (val: any): any => {
        if (val == null)
            val = "";
        return new Uri(val.toString());
    });

    function createRelative (baseUri: Uri, relative: Uri|string): string {
        var rel: string = "";
        if (typeof relative === "string") {
            rel = relative;
        } else if (relative instanceof Uri) {
            rel = relative.originalString;
        }

        var base = baseUri.scheme + "://" + baseUri.host;
        if (rel[0] === "/") {
            rel = rel.substr(1);
            base += "/";
        } else {
            base += baseUri.absolutePath;
        }
        if (base[base.length - 1] !== "/")
            base = base.substr(0, base.lastIndexOf("/") + 1);

        return base + rel;
    }
}
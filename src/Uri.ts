module nullstone {
    export class Uri {
        private $$originalString: string;

        constructor (uri?: string) {
            this.$$originalString = uri;
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
            var ind = Math.max(3, s.indexOf("://") + 3);
            var start = s.indexOf("/", ind);
            if (start < 0 || start < ind)
                return "/";
            var qstart = s.indexOf("?", start);
            if (qstart < 0 || qstart < start)
                qstart = undefined;
            return s.substr(start, qstart);
        }

        get scheme (): string {
            var s = this.$$originalString;
            var ind = s.indexOf("://");
            if (ind < 0)
                return null;
            return s.substr(0, ind);
        }
    }
}
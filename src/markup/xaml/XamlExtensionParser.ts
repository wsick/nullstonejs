module nullstone.markup.xaml {
    // Syntax:
    //      {<Alias|Name> [<DefaultKey>=]<DefaultValue>|<Key>=<Value>}
    // Examples:
    //  {x:Null }
    //  {x:Type }
    //  {x:Static }
    //  {TemplateBinding }
    //  {Binding }
    //  {StaticResource }

    interface IParseContext {
        text: string;
        i: number;
        acc: string;
        error: any;
        resolver: INsPrefixResolver;
    }
    export class XamlExtensionParser implements IMarkupExtensionParser {
        private $$defaultXmlns = "http://schemas.wsick.com/fayde";
        private $$xXmlns = "http://schemas.wsick.com/fayde/x";

        private $$onResolveType: events.IResolveType;
        private $$onResolveObject: events.IResolveObject;
        private $$onResolvePrimitive: events.IResolvePrimitive;
        private $$onError: events.IError;

        setNamespaces (defaultXmlns: string, xXmlns: string): XamlExtensionParser {
            this.$$defaultXmlns = defaultXmlns;
            this.$$xXmlns = xXmlns;
            return this;
        }

        parse (value: string, resolver: INsPrefixResolver, os: any[]): any {
            this.$$ensure();
            var ctx: IParseContext = {
                text: value,
                i: 1,
                acc: "",
                error: "",
                resolver: resolver
            };
            var obj = this.$$doParse(ctx, os);
            if (ctx.error)
                this.$$onError(ctx.error);
            return obj;
        }

        private $$doParse (ctx: IParseContext, os: any[]): any {
            if (!this.$$parseName(ctx))
                return undefined;
            if (!this.$$startExtension(ctx, os))
                return undefined;

            while (ctx.i < ctx.text.length) {
                if (!this.$$parseKeyValue(ctx, os))
                    break;
                if (ctx.text[ctx.i] === "}") {
                    break;
                }
            }

            return os.pop();
        }

        private $$parseName (ctx: IParseContext): boolean {
            var ind = ctx.text.indexOf(" ", ctx.i);
            if (ind > ctx.i) {
                ctx.acc = ctx.text.substr(ctx.i, ind - ctx.i);
                ctx.i = ind + 1;
                return true;
            }
            ind = ctx.text.indexOf("}", ctx.i);
            if (ind > ctx.i) {
                ctx.acc = ctx.text.substr(ctx.i, ind - ctx.i);
                ctx.i = ind;
                return true;
            }
            ctx.error = "Missing closing bracket.";
            return false;
        }

        private $$startExtension (ctx: IParseContext, os: any[]): boolean {
            var full = ctx.acc;
            var ind = full.indexOf(":");
            var prefix = (ind < 0) ? null : full.substr(0, ind);
            var name = (ind < 0) ? full : full.substr(ind + 1);
            var uri = prefix ? ctx.resolver.lookupNamespaceURI(prefix) : DEFAULT_XMLNS;

            if (uri === this.$$xXmlns) {
                var val = ctx.text.substr(ctx.i, ctx.text.length - ctx.i - 1);
                ctx.i = ctx.text.length;
                return this.$$parseXExt(ctx, os, name, val);
            }

            var oresolve = this.$$onResolveType(uri, name);
            var obj = this.$$onResolveObject(oresolve.type);
            os.push(obj);
            return true;
        }

        private $$parseXExt (ctx: IParseContext, os: any[], name: string, val: string): boolean {
            if (name === "Null") {
                os.push(null);
                return true;
            }
            if (name === "Type") {
                var ind = val.indexOf(":");
                var prefix = (ind < 0) ? null : val.substr(0, ind);
                var name = (ind < 0) ? val : val.substr(ind + 1);
                var uri = ctx.resolver.lookupNamespaceURI(prefix);
                var oresolve = this.$$onResolveType(uri, name);
                os.push(oresolve.type);
                return true;
            }
            if (name === "Static") {
                var func = new Function("return (" + val + ");");
                os.push(func());
                return true;
            }
            return true;
        }

        private $$parseKeyValue (ctx: IParseContext, os: any[]): boolean {
            var text = ctx.text;
            ctx.acc = "";
            var key = "";
            var val: any = undefined;
            for (; ctx.i < text.length; ctx.i++) {
                var cur = text[ctx.i];
                if (cur === "\\") {
                    ctx.i++;
                    ctx.acc += text[ctx.i];
                } else if (cur === "{") {
                    if (!key) {
                        ctx.error = "A sub extension must be set to a key.";
                        return false;
                    }
                    ctx.i++;
                    val = this.$$doParse(ctx, os);
                    if (ctx.error)
                        return false;
                } else if (cur === "=") {
                    key = ctx.acc;
                    ctx.acc = "";
                } else if (cur === "}") {
                    this.$$finishKeyValue(ctx.acc, key, val, os);
                    return true;
                } else if (cur === ",") {
                    ctx.i++;
                    this.$$finishKeyValue(ctx.acc, key, val, os);
                    return true;
                } else {
                    ctx.acc += cur;
                }
            }
        }

        private $$finishKeyValue (acc: string, key: string, val: any, os: any[]) {
            if (val === undefined) {
                if (!(val = acc.trim()))
                    return;
            }
            if (typeof val.transmute === "function") {
                val = (<IMarkupExtension>val).transmute(os);
            }
            var co = os[os.length - 1];
            if (!key) {
                co.init && co.init(val);
            } else {
                co[key] = val;
            }
        }

        private $$ensure () {
            this.onResolveType(this.$$onResolveType)
                .onResolveObject(this.$$onResolveObject)
                .onError(this.$$onError);
        }

        onResolveType (cb?: events.IResolveType): XamlExtensionParser {
            var oresolve: IOutType = {
                isPrimitive: false,
                type: Object
            };
            this.$$onResolveType = cb || ((xmlns, name) => oresolve);
            return this;
        }

        onResolveObject (cb?: events.IResolveObject): XamlExtensionParser {
            this.$$onResolveObject = cb || ((type) => new type());
            return this;
        }

        onResolvePrimitive (cb?: events.IResolvePrimitive): XamlExtensionParser {
            this.$$onResolvePrimitive = cb || ((type, text) => new type(text));
            return this;
        }

        onError (cb?: events.IError): XamlExtensionParser {
            this.$$onError = cb || ((e) => {
            });
            return this;
        }
    }
}
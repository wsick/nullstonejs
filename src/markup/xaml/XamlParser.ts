module nullstone.markup.xaml {
    export var DEFAULT_XMLNS = "http://schemas.wsick.com/fayde";
    export var DEFAULT_XMLNS_X = "http://schemas.wsick.com/fayde/x";
    var ERROR_XMLNS = "http://www.w3.org/1999/xhtml";
    var ERROR_NAME = "parsererror";

    export class XamlParser implements IMarkupParser<Element> {
        private $$onResolveType: events.IResolveType;
        private $$onResolveObject: events.IResolveObject;
        private $$onResolvePrimitive: events.IResolvePrimitive;
        private $$onResolveResources: events.IResolveResources;
        private $$onBranchSkip: events.IBranchSkip<Element>;
        private $$onObject: events.IObject;
        private $$onObjectEnd: events.IObjectEnd;
        private $$onContentText: events.IText;
        private $$onName: events.IName;
        private $$onKey: events.IKey;
        private $$onPropertyStart: events.IPropertyStart;
        private $$onPropertyEnd: events.IPropertyEnd;
        private $$onError: events.IError;
        private $$onEnd: () => any = null;

        private $$extension: IMarkupExtensionParser;

        private $$defaultXmlns: string;
        private $$xXmlns: string;

        private $$objectStack: any[] = [];
        private $$skipnext = false;

        constructor () {
            this.setExtensionParser(new XamlExtensionParser())
                .setNamespaces(DEFAULT_XMLNS, DEFAULT_XMLNS_X)
                .on({});
        }

        on (listener: IMarkupSax<Element>): XamlParser {
            listener = createMarkupSax(listener);

            this.$$onResolveType = listener.resolveType;
            this.$$onResolveObject = listener.resolveObject;
            this.$$onResolvePrimitive = listener.resolvePrimitive;
            this.$$onResolveResources = listener.resolveResources;
            this.$$onBranchSkip = listener.branchSkip;
            this.$$onObject = listener.object;
            this.$$onObjectEnd = listener.objectEnd;
            this.$$onContentText = listener.contentText;
            this.$$onName = listener.name;
            this.$$onKey = listener.key;
            this.$$onPropertyStart = listener.propertyStart;
            this.$$onPropertyEnd = listener.propertyEnd;
            this.$$onError = listener.error;
            this.$$onEnd = listener.end;

            if (this.$$extension) {
                this.$$extension
                    .onResolveType(this.$$onResolveType)
                    .onResolveObject(this.$$onResolveObject)
                    .onResolvePrimitive(this.$$onResolvePrimitive);
            }

            return this;
        }

        setNamespaces (defaultXmlns: string, xXmlns: string): XamlParser {
            this.$$defaultXmlns = defaultXmlns;
            this.$$xXmlns = xXmlns;
            if (this.$$extension)
                this.$$extension.setNamespaces(this.$$defaultXmlns, this.$$xXmlns);
            return this;
        }

        setExtensionParser (parser: IMarkupExtensionParser): XamlParser {
            this.$$extension = parser;
            if (parser) {
                parser.setNamespaces(this.$$defaultXmlns, this.$$xXmlns)
                    .onResolveType(this.$$onResolveType)
                    .onResolveObject(this.$$onResolveObject)
                    .onResolvePrimitive(this.$$onResolvePrimitive)
                    .onError((e) => {
                        throw e;
                    });
            }
            return this;
        }

        parse (el: Element): XamlParser {
            if (!this.$$extension)
                throw new Error("No extension parser exists on parser.");
            this.$$handleElement(el, true);
            this.$$destroy();
            return this;
        }

        skipBranch () {
            this.$$skipnext = true;
        }

        private $$handleElement (el: Element, isContent: boolean) {
            // NOTE: Handle tag open
            //  <[ns:]Type.Name>
            //  <[ns:]Type>
            var name = el.localName;
            var xmlns = el.namespaceURI;
            if (this.$$tryHandleError(el, xmlns, name))
                return;
            if (this.$$tryHandlePropertyTag(el, xmlns, name))
                return;

            var os = this.$$objectStack;
            var ort = this.$$onResolveType(xmlns, name);
            if (this.$$tryHandlePrimitive(el, ort, isContent))
                return;

            var obj = this.$$onResolveObject(ort.type);
            os.push(obj);

            this.$$onObject(obj, isContent);

            // NOTE: Walk attributes
            this.$$processAttributes(el);

            if (this.$$skipnext) {
                this.$$skipnext = false;
                os.pop();
                this.$$onObjectEnd(obj, isContent, os[os.length - 1]);
                this.$$onBranchSkip(el.firstElementChild, obj);
                return;
            }

            // NOTE: Handle resources first
            var resEl = findResourcesElement(el, xmlns, name);
            if (resEl)
                this.$$handleResources(obj, ort.type, resEl);

            // NOTE: Walk Children
            var child = el.firstElementChild;
            var hasChildren = !!child;
            while (child) {
                if (!resEl || child !== resEl) //Skip Resources (will be done first)
                    this.$$handleElement(child, true);
                child = child.nextElementSibling;
            }

            // NOTE: If we did not hit a child tag, use text content
            if (!hasChildren) {
                var text = el.textContent;
                if (text)
                    this.$$onContentText(text.trim());
            }

            // NOTE: Handle tag close
            //  </[ns:]Type.Name>
            //  </[ns:]Type>
            os.pop();
            this.$$onObjectEnd(obj, isContent, os[os.length - 1]);
        }

        private $$handleResources (owner: any, ownerType: any, resEl: Element) {
            var os = this.$$objectStack;
            var rd = this.$$onResolveResources(owner, ownerType);
            os.push(rd);
            this.$$onObject(rd, false);
            var child = resEl.firstElementChild;
            while (child) {
                this.$$handleElement(child, true);
                child = child.nextElementSibling;
            }
            os.pop();
            this.$$onObjectEnd(rd, false, os[os.length - 1]);
        }

        private $$tryHandleError (el: Element, xmlns: string, name: string): boolean {
            if (xmlns !== ERROR_XMLNS || name !== ERROR_NAME)
                return false;
            this.$$onError(new Error(el.textContent));
            return true;
        }

        private $$tryHandlePropertyTag (el: Element, xmlns: string, name: string): boolean {
            var ind = name.indexOf('.');
            if (ind < 0)
                return false;

            var type = this.$$onResolveType(xmlns, name.substr(0, ind));
            name = name.substr(ind + 1);

            this.$$onPropertyStart(type, name);

            var child = el.firstElementChild;
            while (child) {
                this.$$handleElement(child, false);
                child = child.nextElementSibling;
            }

            this.$$onPropertyEnd(type, name);

            return true;
        }

        private $$tryHandlePrimitive (el: Element, oresolve: IOutType, isContent: boolean): boolean {
            if (!oresolve.isPrimitive)
                return false;
            var obj = this.$$onResolvePrimitive(oresolve.type, el.textContent);
            this.$$onObject(obj, isContent);
            this.$$processAttributes(el);
            var os = this.$$objectStack;
            this.$$onObjectEnd(obj, isContent, os[os.length - 1]);
            return true;
        }

        private $$processAttributes (el: Element) {
            for (var i = 0, attrs = el.attributes, len = attrs.length; i < len; i++) {
                this.$$processAttribute(attrs[i]);
            }
        }

        private $$processAttribute (attr: Attr): boolean {
            var prefix = attr.prefix;
            var name = attr.localName;
            if (this.$$shouldSkipAttr(prefix, name))
                return true;
            var uri = attr.namespaceURI;
            var value = attr.value;
            if (this.$$tryHandleXAttribute(uri, name, value))
                return true;
            return this.$$handleAttribute(uri, name, value, attr);
        }

        private $$shouldSkipAttr (prefix: string, name: string): boolean {
            if (prefix === "xmlns")
                return true;
            return (!prefix && name === "xmlns");
        }

        private $$tryHandleXAttribute (uri: string, name: string, value: string): boolean {
            //  ... x:Name="..."
            //  ... x:Key="..."
            if (uri !== this.$$xXmlns)
                return false;
            if (name === "Name")
                this.$$onName(value);
            if (name === "Key")
                this.$$onKey(value);
            return true;
        }

        private $$handleAttribute (uri: string, name: string, value: string, attr: Attr): boolean {
            //  ... [ns:]Type.Name="..."
            //  ... Name="..."

            var type = null;
            var name = name;
            var ind = name.indexOf('.');
            if (ind > -1) {
                var oresolve = this.$$onResolveType(uri, name.substr(0, ind));
                type = oresolve.type;
                name = name.substr(ind + 1);
            }
            var os = this.$$objectStack;
            this.$$onPropertyStart(type, name);
            var val = this.$$getAttrValue(value, attr);
            this.$$onObject(val, false);
            this.$$onObjectEnd(val, false, os[os.length - 1]);
            this.$$onPropertyEnd(type, name);
            return true;
        }

        private $$getAttrValue (val: string, attr: Attr): any {
            if (val[0] !== "{")
                return val;
            return this.$$extension.parse(val, attr, this.$$objectStack);
        }

        private $$destroy () {
            this.$$onEnd && this.$$onEnd();
        }
    }

    function findResourcesElement (ownerEl: Element, uri: string, name: string): Element {
        var expected = name + ".Resources";
        var child = ownerEl.firstElementChild;
        while (child) {
            if (child.localName === expected && child.namespaceURI === uri)
                return child;
            child = child.nextElementSibling;
        }
        return null;
    }
}
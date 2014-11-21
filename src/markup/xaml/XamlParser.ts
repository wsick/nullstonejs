module nullstone.markup.xaml {
    export var DEFAULT_XMLNS = "http://schemas.wsick.com/fayde";
    export var DEFAULT_XMLNS_X = "http://schemas.wsick.com/fayde/x";
    var ERROR_XMLNS = "http://www.w3.org/1999/xhtml";
    var ERROR_NAME = "parsererror";

    export module events {
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
        export interface IError {
            (e: Error): boolean;
        }
    }

    export class XamlParser {
        private $$onResolveType: events.IResolveType;
        private $$onResolveObject: events.IResolveObject;
        private $$onObject: events.IObject;
        private $$onObjectEnd: events.IObject;
        private $$onContentObject: events.IObject;
        private $$onContentText: events.IText;
        private $$onName: events.IName;
        private $$onKey: events.IKey;
        private $$onPropertyStart: events.IPropertyStart;
        private $$onPropertyEnd: events.IPropertyEnd;
        private $$onError: events.IError;
        private $$onEnd: () => any = null;

        extension: extensions.XamlExtensionParser;

        private $$defaultXmlns: string;
        private $$xXmlns: string;

        private $$objectStack: any[] = [];

        constructor () {
            this.extension = this.createExtensionParser();
            this.setNamespaces(DEFAULT_XMLNS, DEFAULT_XMLNS_X);
        }

        setNamespaces (defaultXmlns: string, xXmlns: string): XamlParser {
            this.$$defaultXmlns = defaultXmlns;
            this.$$xXmlns = xXmlns;
            this.extension.setNamespaces(defaultXmlns, xXmlns);
            return this;
        }

        createExtensionParser (): extensions.XamlExtensionParser {
            return new extensions.XamlExtensionParser();
        }

        parse (el: Element): XamlParser {
            this.$$ensure();
            this.$$handleElement(el, true);
            this.$$destroy();
            return this;
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

            var type = this.$$onResolveType(xmlns, name);
            var obj = this.$$onResolveObject(type);
            this.$$objectStack.push(obj);

            if (isContent) {
                this.$$onContentObject(obj);
            } else {
                this.$$onObject(obj);
            }

            // NOTE: Walk attributes
            for (var i = 0, attrs = el.attributes, len = attrs.length; i < len; i++) {
                this.$$processAttribute(attrs[i]);
            }

            // NOTE: Walk Children
            var child = el.firstElementChild;
            var hasChildren = !!child;
            while (child) {
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
            this.$$objectStack.pop();
            this.$$onObjectEnd(obj);
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
                type = this.$$onResolveType(uri, name.substr(0, ind));
                name = name.substr(ind + 1);
            }
            this.$$onPropertyStart(type, name);
            var val = this.$$getAttrValue(value, attr);
            this.$$onObject(val);
            this.$$onObjectEnd(val);
            this.$$onPropertyEnd(type, name);
            return true;
        }

        private $$getAttrValue (val: string, attr: Attr): any {
            if (val[0] !== "{")
                return val;
            return this.extension.parse(val, attr, this.$$objectStack);
        }

        private $$ensure () {
            this.onResolveType(this.$$onResolveType)
                .onResolveObject(this.$$onResolveObject)
                .onObject(this.$$onObject)
                .onObjectEnd(this.$$onObjectEnd)
                .onContentObject(this.$$onContentObject)
                .onContentText(this.$$onContentText)
                .onName(this.$$onName)
                .onKey(this.$$onKey)
                .onPropertyStart(this.$$onPropertyStart)
                .onPropertyEnd(this.$$onPropertyEnd)
                .onError(this.$$onError);
            this.extension
                .onResolveType(this.$$onResolveType)
                .onResolveObject(this.$$onResolveObject);
        }

        onResolveType (cb?: events.IResolveType): XamlParser {
            this.$$onResolveType = cb || ((xmlns, name) => Object);
            return this;
        }

        onResolveObject (cb?: events.IResolveObject): XamlParser {
            this.$$onResolveObject = cb || ((type) => new type());
            return this;
        }

        onObject (cb?: events.IObject): XamlParser {
            this.$$onObject = cb || ((obj) => {
            });
            return this;
        }

        onObjectEnd (cb?: events.IObject): XamlParser {
            this.$$onObjectEnd = cb || ((obj) => {
            });
            return this;
        }

        onContentObject (cb?: events.IObject): XamlParser {
            this.$$onContentObject = cb || ((obj) => {
            });
            return this;
        }

        onContentText (cb?: events.IObject): XamlParser {
            this.$$onContentText = cb || ((text) => {
            });
            return this;
        }

        onName (cb?: events.IName): XamlParser {
            this.$$onName = cb || ((name) => {
            });
            return this;
        }

        onKey (cb?: events.IKey): XamlParser {
            this.$$onKey = cb || ((key) => {
            });
            return this;
        }

        onPropertyStart (cb?: events.IPropertyStart): XamlParser {
            this.$$onPropertyStart = cb || ((ownerType, propName) => {
            });
            return this;
        }

        onPropertyEnd (cb?: events.IPropertyEnd): XamlParser {
            this.$$onPropertyEnd = cb || ((ownerType, propName) => {
            });
            return this;
        }

        onError (cb?: events.IError): XamlParser {
            this.$$onError = cb || ((e) => true);
            return this;
        }

        onEnd (cb: () => any): XamlParser {
            this.$$onEnd = cb;
            return this;
        }

        private $$destroy () {
            this.$$onEnd && this.$$onEnd();
        }
    }
}
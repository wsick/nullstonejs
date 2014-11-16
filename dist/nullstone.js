var nullstone;
(function (nullstone) {
    nullstone.version = '0.1.0';
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var DirTypeResolver = (function () {
        function DirTypeResolver() {
        }
        DirTypeResolver.prototype.resolve = function (moduleName, name, oresolve) {
            return require(moduleName + '/' + name);
        };
        return DirTypeResolver;
    })();
    nullstone.DirTypeResolver = DirTypeResolver;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var Enum = (function () {
        function Enum(Object) {
            this.Object = Object;
        }
        return Enum;
    })();
    nullstone.Enum = Enum;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var Library = (function () {
        function Library() {
            this.$$module = null;
        }
        Library.prototype.resolve = function (moduleName, name, oresolve) {
            oresolve.isPrimitive = false;
            oresolve.type = undefined;
            var curModule = this.$$module;
            for (var i = 0, tokens = moduleName.split('.'); i < tokens.length && !!curModule; i++) {
                curModule = curModule[tokens[i]];
            }
            if (!curModule)
                return false;
            oresolve.type = curModule[name];
            return oresolve.type !== undefined;
        };
        return Library;
    })();
    nullstone.Library = Library;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var LibraryResolver = (function () {
        function LibraryResolver() {
        }
        LibraryResolver.prototype.resolve = function (uri) {
            return null;
        };
        return LibraryResolver;
    })();
    nullstone.LibraryResolver = LibraryResolver;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    
    var TypeResolver = (function () {
        function TypeResolver(defaultUri, primitiveUri) {
            this.defaultUri = defaultUri;
            this.primitiveUri = primitiveUri;
            this.$$primtypes = {};
            this.$$systypes = {};
            this.$$ns = {};
            this.libResolver = new nullstone.LibraryResolver();
            this.dirTypeResolver = new nullstone.DirTypeResolver();
            this.addPrimitive("String", String).addPrimitive("Number", Number).addPrimitive("Double", Number).addPrimitive("Date", Date).addPrimitive("RegExp", RegExp).addPrimitive("Boolean", Boolean).addSystem("Array", Array);
        }
        TypeResolver.prototype.addPrimitive = function (name, type) {
            this.$$primtypes[name] = type;
            return this;
        };

        TypeResolver.prototype.addSystem = function (name, type) {
            this.$$systypes[name] = type;
            return this;
        };

        TypeResolver.prototype.add = function (uri, name, type) {
            var ns = this.$$ns[uri];
            if (!ns)
                ns = this.$$ns[ns] || {};
            ns[name] = type;
            return this;
        };

        TypeResolver.prototype.resolve = function (uri, name, oresolve) {
            oresolve.type = undefined;
            if (uri.indexOf("http://") === 0)
                return this.$$resolveUrlType(uri, name, oresolve);
            if (uri.indexOf("lib://") === 0)
                return this.$$resolveLibType(uri, name, oresolve);
            return this.$$resolveDirType(uri, name, oresolve);
        };

        TypeResolver.prototype.$$resolveUrlType = function (uri, name, oresolve) {
            if (uri === this.primitiveUri) {
                oresolve.isPrimitive = true;
                if ((oresolve.type = this.$$primtypes[name]) !== undefined)
                    return true;
            }

            oresolve.isPrimitive = false;
            if (uri === this.defaultUri) {
                if ((oresolve.type = this.$$systypes[name]) !== undefined)
                    return true;
            }

            var ns = this.$$ns[uri];
            if (ns) {
                if ((oresolve.type = ns[name]) !== undefined)
                    return true;
            }
            return false;
        };

        TypeResolver.prototype.$$resolveLibType = function (uri, name, oresolve) {
            var libResolver = this.libResolver;
            if (!libResolver)
                return false;
            var libName = uri.substr(6);
            var moduleName = "";
            var ind = libName.indexOf('/');
            if (ind > -1) {
                moduleName = libName.substr(ind + 1);
                libName = libName.substr(0, ind);
            }
            var lib = libResolver.resolve(libName);
            return !!lib && lib.resolve(moduleName, name, oresolve);
        };

        TypeResolver.prototype.$$resolveDirType = function (uri, name, oresolve) {
            var resolver = this.dirTypeResolver;
            return !!resolver && resolver.resolve(uri, name, oresolve);
        };
        return TypeResolver;
    })();
    nullstone.TypeResolver = TypeResolver;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    function Annotation(type, name, value, forbidMultiple) {
        var at = type;
        var anns = at.$$annotations;
        if (!anns)
            Object.defineProperty(at, "$$annotations", { value: (anns = []), writable: false });
        var ann = anns[name];
        if (!ann)
            anns[name] = ann = [];
        if (forbidMultiple && ann.length > 0)
            throw new Error("Only 1 content annotation allowed per type [" + type.constructor.name + "].");
        ann.push(value);
    }
    nullstone.Annotation = Annotation;

    function GetAnnotations(type, name) {
        var at = type;
        var anns = at.$$annotations;
        if (!anns)
            return undefined;
        return (anns[name] || []).slice(0);
    }
    nullstone.GetAnnotations = GetAnnotations;

    function CreateTypedAnnotation(name) {
        function ta(type) {
            var values = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                values[_i] = arguments[_i + 1];
            }
            for (var i = 0, len = values.length; i < len; i++) {
                Annotation(type, name, values[i]);
            }
        }

        ta.Get = function (type) {
            return GetAnnotations(type, name);
        };
        return ta;
    }
    nullstone.CreateTypedAnnotation = CreateTypedAnnotation;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var converters = [];
    converters[Boolean] = function (val) {
        if (val == null)
            return null;
        if (typeof val === "boolean")
            return val;
        var c = val.toString().toUpperCase();
        return c === "TRUE" ? true : (c === "FALSE" ? false : null);
    };
    converters[String] = function (val) {
        if (val == null)
            return "";
        return val.toString();
    };
    converters[Number] = function (val) {
        if (!val)
            return 0;
        if (typeof val === "number")
            return val;
        return parseFloat(val.toString());
    };
    converters[Date] = function (val) {
        if (val == null)
            return new Date(0);
        return new Date(val.toString());
    };
    converters[RegExp] = function (val) {
        if (val instanceof RegExp)
            return val;
        if (val = null)
            throw new Error("Cannot specify an empty RegExp.");
        val = val.toString();
        return new RegExp(val);
    };

    function ConvertAnyToType(val, type) {
        var converter = converters[type];
        if (converter)
            return converter(val);
        if (type instanceof nullstone.Enum) {
            var enumo = type.Object;
            if (enumo.Converter)
                return enumo.Converter(val);
            val = val || 0;
            if (typeof val === "string")
                return enumo[val];
            return val;
        }
        return val;
    }
    nullstone.ConvertAnyToType = ConvertAnyToType;

    function RegisterTypeConverter(type, converter) {
        converters[type] = converter;
    }
    nullstone.RegisterTypeConverter = RegisterTypeConverter;

    function RegisterEnumConverter(e, converter) {
        e.Converter = converter;
    }
    nullstone.RegisterEnumConverter = RegisterEnumConverter;
})(nullstone || (nullstone = {}));
//# sourceMappingURL=nullstone.js.map

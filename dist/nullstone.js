var nullstone;
(function (nullstone) {
    nullstone.version = '0.1.0';
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var DirResolver = (function () {
        function DirResolver() {
        }
        DirResolver.prototype.loadAsync = function (moduleName, name) {
            var reqUri = moduleName + '/' + name;
            return nullstone.async.create(function (resolve, reject) {
                require([reqUri], function (rootModule) {
                    resolve(rootModule);
                }, reject);
            });
        };

        DirResolver.prototype.resolveType = function (moduleName, name, oresolve) {
            oresolve.isPrimitive = false;
            oresolve.type = require(moduleName + '/' + name);
            return oresolve.type !== undefined;
        };
        return DirResolver;
    })();
    nullstone.DirResolver = DirResolver;
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
    var Event = (function () {
        function Event() {
            this.$$callbacks = [];
            this.$$scopes = [];
        }
        Object.defineProperty(Event.prototype, "has", {
            get: function () {
                return this.$$callbacks.length > 0;
            },
            enumerable: true,
            configurable: true
        });

        Event.prototype.on = function (callback, scope) {
            this.$$callbacks.push(callback);
            this.$$scopes.push(scope);
        };

        Event.prototype.off = function (callback, scope) {
            var cbs = this.$$callbacks;
            var scopes = this.$$scopes;
            var search = cbs.length - 1;
            while (search > 0) {
                search = cbs.lastIndexOf(callback, search);
                if (scopes[search] === scope) {
                    cbs.splice(search, 1);
                    scopes.splice(search, 1);
                }
                search--;
            }
        };

        Event.prototype.raise = function (sender, args) {
            for (var i = 0, cbs = this.$$callbacks.slice(0), scopes = this.$$scopes.slice(0), len = cbs.length; i < len; i++) {
                cbs[i].call(scopes[i], sender, args);
            }
        };

        Event.prototype.raiseAsync = function (sender, args) {
            var _this = this;
            window.setTimeout(function () {
                return _this.raise(sender, args);
            }, 1);
        };
        return Event;
    })();
    nullstone.Event = Event;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var Interface = (function () {
        function Interface(name) {
            Object.defineProperty(this, "name", { value: name, writable: false });
        }
        Interface.prototype.is = function (o) {
            if (!o)
                return false;
            var type = o.constructor;
            while (type) {
                var is = type.$$interfaces;
                if (is && is.indexOf(this) > -1)
                    return true;
                type = nullstone.getTypeParent(type);
            }
            return false;
        };

        Interface.prototype.as = function (o) {
            if (!this.is(o))
                return undefined;
            return o;
        };
        return Interface;
    })();
    nullstone.Interface = Interface;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    nullstone.ICollection_ = new nullstone.Interface("ICollection");
    nullstone.ICollection_.is = function (o) {
        if (!o)
            return false;
        return typeof o.GetValueAt === "function" && typeof o.SetValueAt === "function";
    };
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    nullstone.IEnumerable_ = new nullstone.Interface("IEnumerable");
    nullstone.IEnumerable_.is = function (o) {
        return o && o.getEnumerator && typeof o.getEnumerator === "function";
    };

    nullstone.IEnumerable_.empty = {
        getEnumerator: function (isReverse) {
            return nullstone.IEnumerator_.empty;
        }
    };

    nullstone.IEnumerable_.fromArray = function (arr) {
        return {
            $$arr: arr,
            getEnumerator: function (isReverse) {
                return nullstone.IEnumerator_.fromArray(this.$$arr, isReverse);
            }
        };
    };
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    nullstone.IEnumerator_ = new nullstone.Interface("IEnumerator");

    nullstone.IEnumerator_.empty = {
        current: undefined,
        moveNext: function () {
            return false;
        }
    };

    nullstone.IEnumerator_.fromArray = function (arr, isReverse) {
        var len = arr.length;
        var e = { moveNext: undefined, current: undefined };
        var index;
        if (isReverse) {
            index = len;
            e.moveNext = function () {
                index--;
                if (index < 0) {
                    e.current = undefined;
                    return false;
                }
                e.current = arr[index];
                return true;
            };
        } else {
            index = -1;
            e.moveNext = function () {
                index++;
                if (index >= len) {
                    e.current = undefined;
                    return false;
                }
                e.current = arr[index];
                return true;
            };
        }
        return e;
    };
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var IndexedPropertyInfo = (function () {
        function IndexedPropertyInfo() {
        }
        Object.defineProperty(IndexedPropertyInfo.prototype, "propertyType", {
            get: function () {
                return undefined;
            },
            enumerable: true,
            configurable: true
        });

        IndexedPropertyInfo.prototype.getValue = function (ro, index) {
            if (this.GetFunc)
                return this.GetFunc.call(ro, index);
        };

        IndexedPropertyInfo.prototype.setValue = function (ro, index, value) {
            if (this.SetFunc)
                this.SetFunc.call(ro, index, value);
        };

        IndexedPropertyInfo.find = function (typeOrObj) {
            var o = typeOrObj;
            var isType = typeOrObj instanceof Function;
            if (isType)
                o = new typeOrObj();

            if (o instanceof Array) {
                var pi = new IndexedPropertyInfo();
                pi.GetFunc = function (index) {
                    return this[index];
                };
                pi.SetFunc = function (index, value) {
                    this[index] = value;
                };
                return pi;
            }
            var coll = nullstone.ICollection_.as(o);
            if (coll) {
                var pi = new IndexedPropertyInfo();
                pi.GetFunc = function (index) {
                    return this.GetValueAt(index);
                };
                pi.SetFunc = function (index, value) {
                    return this.SetValueAt(index, value);
                };
                return pi;
            }
        };
        return IndexedPropertyInfo;
    })();
    nullstone.IndexedPropertyInfo = IndexedPropertyInfo;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var Library = (function () {
        function Library(uri) {
            this.$$module = null;
            this.$$sourcePath = null;
            this.$$primtypes = {};
            this.$$types = {};
            Object.defineProperty(this, "uri", { value: uri, writable: false });
        }
        Object.defineProperty(Library.prototype, "sourcePath", {
            get: function () {
                return this.$$sourcePath || 'lib/' + this.uri + '/' + this.uri;
            },
            set: function (value) {
                if (value.substr(value.length - 3) === '.js')
                    value = value.substr(0, value.length - 3);
                this.$$sourcePath = value;
            },
            enumerable: true,
            configurable: true
        });


        Object.defineProperty(Library.prototype, "rootModule", {
            get: function () {
                return this.$$module = this.$$module || require(this.sourcePath);
            },
            enumerable: true,
            configurable: true
        });

        Library.prototype.loadAsync = function () {
            var _this = this;
            this.$configModule();
            return nullstone.async.create(function (resolve, reject) {
                require([_this.uri], function (rootModule) {
                    _this.$$module = rootModule;
                    resolve(_this);
                }, reject);
            });
        };

        Library.prototype.$configModule = function () {
            var co = {
                paths: {},
                shim: {},
                map: {
                    "*": {}
                }
            };
            var srcPath = this.sourcePath;
            co.paths[this.uri] = srcPath;
            co.shim[this.uri] = {
                exports: this.exports
            };
            co.map['*'][srcPath] = this.uri;
            require.config(co);
        };

        Library.prototype.resolveType = function (moduleName, name, oresolve) {
            if (!moduleName) {
                oresolve.isPrimitive = true;
                if ((oresolve.type = this.$$primtypes[name]) !== undefined)
                    return true;
                oresolve.isPrimitive = false;
                return (oresolve.type = this.$$types[name]) !== undefined;
            }

            var curModule = this.rootModule;
            oresolve.isPrimitive = false;
            oresolve.type = undefined;
            if (moduleName !== "/") {
                for (var i = 0, tokens = moduleName.substr(1).split('.'); i < tokens.length && !!curModule; i++) {
                    curModule = curModule[tokens[i]];
                }
            }
            if (!curModule)
                return false;
            oresolve.type = curModule[name];
            return oresolve.type !== undefined;
        };

        Library.prototype.add = function (name, type) {
            if (!type)
                throw new Error("A type must be specified when registering '" + name + "'`.");
            Object.defineProperty(type, "$$uri", { value: this.uri, writable: false });
            this.$$types[name] = type;
            return this;
        };

        Library.prototype.addPrimitive = function (name, type) {
            if (!type)
                throw new Error("A type must be specified when registering '" + name + "'`.");
            Object.defineProperty(type, "$$uri", { value: this.uri, writable: false });
            this.$$primtypes[name] = type;
            return this;
        };

        Library.prototype.addEnum = function (name, enu) {
            this.add(name, enu);
            Object.defineProperty(enu, "$$enum", { value: true, writable: false });
            enu.name = name;
            return this;
        };
        return Library;
    })();
    nullstone.Library = Library;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var LibraryResolver = (function () {
        function LibraryResolver() {
            this.$$libs = {};
            this.dirResolver = new nullstone.DirResolver();
        }
        LibraryResolver.prototype.createLibrary = function (uri) {
            return new nullstone.Library(uri);
        };

        LibraryResolver.prototype.loadTypeAsync = function (uri, name) {
            var lib = this.resolve(uri);
            if (lib)
                return lib.loadAsync();
            return this.dirResolver.loadAsync(uri, name);
        };

        LibraryResolver.prototype.resolve = function (uri) {
            var libUri = new nullstone.Uri(uri);
            var scheme = libUri.scheme;
            if (!scheme)
                return null;

            var libName = (scheme === "lib") ? libUri.host : uri;
            var lib = this.$$libs[libName];
            if (!lib)
                lib = this.$$libs[libName] = this.createLibrary(libName);
            return lib;
        };

        LibraryResolver.prototype.resolveType = function (uri, name, oresolve) {
            var libUri = new nullstone.Uri(uri);
            var scheme = libUri.scheme;
            if (!scheme)
                return this.dirResolver.resolveType(uri, name, oresolve);

            var libName = (scheme === "lib") ? libUri.host : uri;
            var modName = (scheme === "lib") ? libUri.absolutePath : "";
            var lib = this.$$libs[libName];
            if (!lib)
                lib = this.$$libs[libName] = this.createLibrary(libName);
            return lib.resolveType(modName, name, oresolve);
        };
        return LibraryResolver;
    })();
    nullstone.LibraryResolver = LibraryResolver;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    function getPropertyDescriptor(obj, name) {
        if (!obj)
            return undefined;
        var type = obj.constructor;
        var propDesc = Object.getOwnPropertyDescriptor(type.prototype, name);
        if (propDesc)
            return propDesc;
        return Object.getOwnPropertyDescriptor(obj, name);
    }
    nullstone.getPropertyDescriptor = getPropertyDescriptor;

    function hasProperty(obj, name) {
        if (!obj)
            return false;
        if (obj.hasOwnProperty(name))
            return true;
        var type = obj.constructor;
        return type.prototype.hasOwnProperty(name);
    }
    nullstone.hasProperty = hasProperty;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    var PropertyInfo = (function () {
        function PropertyInfo() {
        }
        PropertyInfo.prototype.getValue = function (obj) {
            if (this.$$getFunc)
                return this.$$getFunc.call(obj);
        };

        PropertyInfo.prototype.setValue = function (obj, value) {
            if (this.$$setFunc)
                return this.$$setFunc.call(obj, value);
        };

        PropertyInfo.find = function (typeOrObj, name) {
            var o = typeOrObj;
            var isType = typeOrObj instanceof Function;
            if (isType)
                o = new typeOrObj();

            if (!(o instanceof Object))
                return null;

            var nameClosure = name;
            var propDesc = nullstone.getPropertyDescriptor(o, name);
            if (propDesc) {
                var pi = new PropertyInfo();
                pi.$$getFunc = propDesc.get;
                if (!pi.$$getFunc)
                    pi.$$getFunc = function () {
                        return this[nameClosure];
                    };
                pi.$$setFunc = propDesc.set;
                if (!pi.$$setFunc && propDesc.writable)
                    pi.$$setFunc = function (value) {
                        this[nameClosure] = value;
                    };
                return pi;
            }

            var type = isType ? typeOrObj : typeOrObj.constructor;
            var pi = new PropertyInfo();
            pi.$$getFunc = type.prototype["Get" + name];
            pi.$$setFunc = type.prototype["Set" + name];
            return pi;
        };
        return PropertyInfo;
    })();
    nullstone.PropertyInfo = PropertyInfo;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    function getTypeName(type) {
        var t = type;
        if (!t)
            return "";
        var name = t.name;
        if (name)
            return name;
        var name = t.toString().match(/function ([^\(]+)/)[1];
        Object.defineProperty(t, "name", { enumerable: false, value: name, writable: false });
        return name;
    }
    nullstone.getTypeName = getTypeName;

    function getTypeParent(type) {
        if (type === Object)
            return null;
        var p = type.$$parent;
        if (!p) {
            if (!type.prototype)
                return undefined;
            p = Object.getPrototypeOf(type.prototype).constructor;
            Object.defineProperty(type, "$$parent", { value: p, writable: false });
        }
        return p;
    }
    nullstone.getTypeParent = getTypeParent;

    function addTypeInterfaces(type) {
        var interfaces = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            interfaces[_i] = arguments[_i + 1];
        }
        if (!interfaces)
            return;
        for (var j = 0, len = interfaces.length; j < len; j++) {
            if (!interfaces[j]) {
                console.warn("Registering undefined interface on type.", type);
                break;
            }
        }
        Object.defineProperty(type, "$$interfaces", { value: interfaces, writable: false });
    }
    nullstone.addTypeInterfaces = addTypeInterfaces;
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

    function convertAnyToType(val, type) {
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
    nullstone.convertAnyToType = convertAnyToType;

    function registerTypeConverter(type, converter) {
        converters[type] = converter;
    }
    nullstone.registerTypeConverter = registerTypeConverter;

    function registerEnumConverter(e, converter) {
        e.Converter = converter;
    }
    nullstone.registerEnumConverter = registerEnumConverter;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    (function (UriKind) {
        UriKind[UriKind["RelativeOrAbsolute"] = 0] = "RelativeOrAbsolute";
        UriKind[UriKind["Absolute"] = 1] = "Absolute";
        UriKind[UriKind["Relative"] = 2] = "Relative";
    })(nullstone.UriKind || (nullstone.UriKind = {}));
    var UriKind = nullstone.UriKind;
    var Uri = (function () {
        function Uri(uri, kind) {
            if (typeof uri === "string") {
                this.$$originalString = uri;
                this.$$kind = kind || 0 /* RelativeOrAbsolute */;
            } else if (uri instanceof Uri) {
                this.$$originalString = uri.$$originalString;
                this.$$kind = uri.$$kind;
            }
        }
        Object.defineProperty(Uri.prototype, "kind", {
            get: function () {
                return this.$$kind;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Uri.prototype, "host", {
            get: function () {
                var s = this.$$originalString;
                var ind = Math.max(3, s.indexOf("://") + 3);
                var end = s.indexOf("/", ind);

                return (end < 0) ? s.substr(ind) : s.substr(ind, end - ind);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Uri.prototype, "absolutePath", {
            get: function () {
                var s = this.$$originalString;
                var ind = Math.max(3, s.indexOf("://") + 3);
                var start = s.indexOf("/", ind);
                if (start < 0 || start < ind)
                    return "/";
                var qstart = s.indexOf("?", start);
                if (qstart < 0 || qstart < start)
                    return s.substr(start);
                return s.substr(start, qstart - start);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Uri.prototype, "scheme", {
            get: function () {
                var s = this.$$originalString;
                var ind = s.indexOf("://");
                if (ind < 0)
                    return null;
                return s.substr(0, ind);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Uri.prototype, "fragment", {
            get: function () {
                var s = this.$$originalString;
                var ind = s.indexOf("#");
                if (ind < 0)
                    return "";
                return s.substr(ind);
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Uri.prototype, "originalString", {
            get: function () {
                return this.$$originalString.toString();
            },
            enumerable: true,
            configurable: true
        });

        Uri.prototype.toString = function () {
            return this.$$originalString.toString();
        };

        Uri.prototype.equals = function (other) {
            return this.$$originalString === other.$$originalString;
        };

        Uri.isNullOrEmpty = function (uri) {
            if (uri == null)
                return true;
            return !uri.$$originalString;
        };
        return Uri;
    })();
    nullstone.Uri = Uri;
    nullstone.registerTypeConverter(Uri, function (val) {
        if (val == null)
            val = "";
        return new Uri(val.toString());
    });
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    
    var TypeManager = (function () {
        function TypeManager(defaultUri, xUri) {
            this.defaultUri = defaultUri;
            this.xUri = xUri;
            this.libResolver = new nullstone.LibraryResolver();
            this.libResolver.resolve(defaultUri).add("Array", Array);

            this.libResolver.resolve(xUri).addPrimitive("String", String).addPrimitive("Number", Number).addPrimitive("Double", Number).addPrimitive("Date", Date).addPrimitive("RegExp", RegExp).addPrimitive("Boolean", Boolean).addPrimitive("Uri", nullstone.Uri);
        }
        TypeManager.prototype.resolveLibrary = function (uri) {
            return this.libResolver.resolve(uri);
        };

        TypeManager.prototype.loadTypeAsync = function (uri, name) {
            return this.libResolver.loadTypeAsync(uri, name);
        };

        TypeManager.prototype.resolveType = function (uri, name, oresolve) {
            oresolve.isPrimitive = false;
            oresolve.type = undefined;
            return this.libResolver.resolveType(uri, name, oresolve);
        };

        TypeManager.prototype.add = function (uri, name, type) {
            var lib = this.libResolver.resolve(uri);
            if (lib)
                lib.add(name, type);
            return this;
        };

        TypeManager.prototype.addPrimitive = function (uri, name, type) {
            var lib = this.libResolver.resolve(uri);
            if (lib)
                lib.addPrimitive(name, type);
            return this;
        };

        TypeManager.prototype.addEnum = function (uri, name, enu) {
            var lib = this.libResolver.resolve(uri);
            if (lib)
                lib.addEnum(name, enu);
            return this;
        };
        return TypeManager;
    })();
    nullstone.TypeManager = TypeManager;
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
            throw new Error("Only 1 '" + name + "' annotation allowed per type [" + type.constructor.name + "].");
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
    (function (async) {
        function create(resolution) {
            var onSuccess;
            var onError;

            var resolvedResult;

            function resolve(result) {
                resolvedResult = result;
                onSuccess && onSuccess(result);
            }

            var resolvedError;

            function reject(error) {
                resolvedError = error;
                onError && onError(error);
            }

            resolution(resolve, reject);

            var req = {
                then: function (success, errored) {
                    onSuccess = success;
                    onError = errored;
                    if (resolvedResult !== undefined)
                        onSuccess && onSuccess(resolvedResult);
                    else if (resolvedError !== undefined)
                        onError && onError(resolvedError);
                    return req;
                }
            };
            return req;
        }
        async.create = create;

        function resolve(obj) {
            return async.create(function (resolve, reject) {
                resolve(obj);
            });
        }
        async.resolve = resolve;

        function reject(err) {
            return async.create(function (resolve, reject) {
                reject(err);
            });
        }
        async.reject = reject;

        function many(arr) {
            if (!arr || arr.length < 1)
                return resolve([]);

            return create(function (resolve, reject) {
                var resolves = new Array(arr.length);
                var errors = new Array(arr.length);
                var finished = 0;
                var count = arr.length;
                var anyerrors = false;

                function completeSingle(i, res, err) {
                    resolves[i] = res;
                    errors[i] = err;
                    anyerrors = anyerrors || err !== undefined;
                    finished++;
                    if (finished >= count)
                        anyerrors ? reject(errors) : resolve(resolves);
                }

                for (var i = 0; i < count; i++) {
                    arr[i].then(function (resi) {
                        return completeSingle(i, resi, undefined);
                    }, function (erri) {
                        return completeSingle(i, undefined, erri);
                    });
                }
            });
        }
        async.many = many;
    })(nullstone.async || (nullstone.async = {}));
    var async = nullstone.async;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    function equals(val1, val2) {
        if (val1 == null && val2 == null)
            return true;
        if (val1 == null || val2 == null)
            return false;
        if (val1 === val2)
            return true;
        return !!val1.equals && val1.equals(val2);
    }
    nullstone.equals = equals;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    (function (markup) {
        markup.NO_PARSER = {
            onResolveType: function (cb) {
                return markup.NO_PARSER;
            },
            parse: function (root) {
            }
        };
    })(nullstone.markup || (nullstone.markup = {}));
    var markup = nullstone.markup;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    (function (_markup) {
        var mds = [];

        function createMarkup(markupType, uri) {
            var url = uri.toString();
            var md = mds[url];
            if (md)
                return md;
            md = new markupType();
            md.uri = new nullstone.Uri(url);
            return md;
        }
        _markup.createMarkup = createMarkup;

        var Markup = (function () {
            function Markup() {
            }
            Markup.prototype.createParser = function () {
                return _markup.NO_PARSER;
            };

            Markup.prototype.resolve = function (typemgr) {
                var resolver = new _markup.MarkupDependencyResolver(typemgr, this.createParser());
                resolver.collect(this.root);
                return resolver.resolve();
            };

            Markup.prototype.loadAsync = function () {
                var reqUri = "text!" + this.uri.toString();
                var md = this;
                return nullstone.async.create(function (resolve, reject) {
                    require([reqUri], function (data) {
                        md.setRoot(md.loadRoot(data));
                        resolve(md);
                    }, reject);
                });
            };

            Markup.prototype.loadRoot = function (data) {
                return data;
            };

            Markup.prototype.setRoot = function (markup) {
                this.root = markup;
                return this;
            };
            return Markup;
        })();
        _markup.Markup = Markup;
    })(nullstone.markup || (nullstone.markup = {}));
    var markup = nullstone.markup;
})(nullstone || (nullstone = {}));
var nullstone;
(function (nullstone) {
    (function (markup) {
        var MarkupDependencyResolver = (function () {
            function MarkupDependencyResolver(typeManager, parser) {
                this.typeManager = typeManager;
                this.parser = parser;
                this.$$uris = [];
                this.$$names = [];
                this.$$resolving = [];
            }
            MarkupDependencyResolver.prototype.collect = function (root) {
                var _this = this;
                this.parser.onResolveType(function (uri, name) {
                    _this.add(uri, name);
                    return Object;
                }).parse(root);
            };

            MarkupDependencyResolver.prototype.add = function (uri, name) {
                var uris = this.$$uris;
                var names = this.$$names;
                var ind = uris.indexOf(uri);
                if (ind > -1 && names[ind] === name)
                    return false;
                if (this.$$resolving.indexOf(uri + "/" + name) > -1)
                    return false;
                uris.push(uri);
                names.push(name);
                return true;
            };

            MarkupDependencyResolver.prototype.resolve = function () {
                var as = [];
                for (var i = 0, uris = this.$$uris, names = this.$$names, tm = this.typeManager, resolving = this.$$resolving; i < uris.length; i++) {
                    var uri = uris[i];
                    var name = names[i];
                    resolving.push(uri + "/" + name);
                    as.push(tm.loadTypeAsync(uri, name));
                }
                return nullstone.async.many(as);
            };
            return MarkupDependencyResolver;
        })();
        markup.MarkupDependencyResolver = MarkupDependencyResolver;
    })(nullstone.markup || (nullstone.markup = {}));
    var markup = nullstone.markup;
})(nullstone || (nullstone = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var nullstone;
(function (nullstone) {
    (function (xaml) {
        var parser = new DOMParser();

        var Xaml = (function (_super) {
            __extends(Xaml, _super);
            function Xaml() {
                _super.apply(this, arguments);
            }
            Xaml.create = function (uri) {
                return nullstone.markup.createMarkup(Xaml, uri);
            };

            Xaml.prototype.createParser = function () {
                return new sax.xaml.Parser();
            };

            Xaml.prototype.loadRoot = function (data) {
                var doc = parser.parseFromString(data, "text/xml");
                return doc.documentElement;
            };
            return Xaml;
        })(nullstone.markup.Markup);
        xaml.Xaml = Xaml;
    })(nullstone.xaml || (nullstone.xaml = {}));
    var xaml = nullstone.xaml;
})(nullstone || (nullstone = {}));
//# sourceMappingURL=nullstone.js.map

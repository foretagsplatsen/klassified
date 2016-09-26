(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        root.klassified = factory(root.$);    }
}(this, function ($) {
/**
 * @license almond 0.3.2 Copyright jQuery Foundation and other contributors.
 * Released under MIT license, http://github.com/requirejs/almond/LICENSE
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part, normalizedBaseParts,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name) {
            name = name.split('/');
            lastIndex = name.length - 1;

            // If wanting node ID compatibility, strip .js from end
            // of IDs. Have to do this here, and not in nameToUrl
            // because node allows either .js or non .js to map
            // to same file.
            if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
            }

            // Starts with a '.' so need the baseName
            if (name[0].charAt(0) === '.' && baseParts) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that 'directory' and not name of the baseName's
                //module. For instance, baseName of 'one/two/three', maps to
                //'one/two/three.js', but we want the directory, 'one/two' for
                //this normalization.
                normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                name = normalizedBaseParts.concat(name);
            }

            //start trimDots
            for (i = 0; i < name.length; i++) {
                part = name[i];
                if (part === '.') {
                    name.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    // If at the start, or previous value is still ..,
                    // keep them so that when converted to a path it may
                    // still work when converted to a path, even though
                    // as an ID it is less than ideal. In larger point
                    // releases, may be better to just kick out an error.
                    if (i === 0 || (i === 1 && name[2] === '..') || name[i - 1] === '..') {
                        continue;
                    } else if (i > 0) {
                        name.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
            //end trimDots

            name = name.join('/');
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            var args = aps.call(arguments, 0);

            //If first arg is not require('string'), and there is only
            //one arg, it is the array form without a callback. Insert
            //a null so that the following concat is correct.
            if (typeof args[0] !== 'string' && args.length === 1) {
                args.push(null);
            }
            return req.apply(undef, args.concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {
        if (typeof name !== 'string') {
            throw new Error('See almond README: incorrect module build, no module name');
        }

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());
define('object',[], function() {

	/**
	 * `object` is the base class of the object model.
	 * It provides facilities to create subclasses and common methods.
	 *
	 * @example Basic usage
	 *
	 * Creating subclasses & using inheritance:
	 *
	 *    var animal = object.subclass(function(that, my) {
	 *
	 *        my.initialize = function(spec) {
	 *            my.super();
	 *            my.name = spec.name;
	 *        };
	 *
	 *        that.getName = function() {
	 *            return my.name;
	 *        };
	 *
	 *        that.say = function(something) {
	 *            my.subclassResponsibility();
	 *        };
	 *    });
	 *
	 *
	 *    var dog = animal.subclass(function(that, my) {
	 *
	 *        that.getName = function() {
	 *            return "dog " + that.super();
	 *        };
	 *
	 *        that.say = function(something) {
	 *            return "Woof Woof, " + something;
	 *        };
	 *    });
	 *
	 * Creating instances:
	 *
	 *    var milou = dog({name: milou});
	 *    milou.say("hello Tintin"); ;; => "Woof Woof, hello Tintin"
	 *    milou.getName(); // => "dog milou"
	 *
	 * @param{{}} spec
	 * @param{{}} my
	 * @return {object}
	 */
	function object(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = {};

		that.getClass = function() {
			return object;
		};

		/**
		 * initialize is called by the framework upon object instantiation.
		 */
		my.initialize = function() {};

		/**
		 * Throws an error because the method should have been overridden.
		 */
		my.subclassResponsibility = subclassResponsibility;

		/**
		 * Getter/Setter generation
		 */
		my.get = function(propName, getter) {
			if(!getter) {
				getter = function() {
					return my[propName];
				};
			}
			that["get" + capitalized(propName)] = getter;
		};

		my.set = function(propName, setter) {
			if(!setter) {
				setter = function(value) {
					my[propName] = value;
					return value;
				};
			}
			that["set" + capitalized(propName)] = setter;
		};

		// install extensions by hand for object, since we do not have the
		// extension installation of the subclasses
		that.getClass().extensions.forEach(function(extension) {
			extension(that, my);
		});

		return that;
	}

	/**
	 * Return an array of direct subclasses.
	 */
	object.subclasses = [];

	/**
	 * Return an array of all subclasses.
	 */
	object.allSubclasses = function() {
		var allSubclasses = this.subclasses.slice();
		this.subclasses.forEach(function(klass) {
			klass.allSubclasses().forEach(function(subclass) {
				allSubclasses.push(subclass);
			});
		});
		return allSubclasses;
	};

	object.subclassResponsibility = subclassResponsibility;

	/**
	 * Return an array of all extensions of the class, see `object.extend`.
	 */
	object.extensions = [];

	var superCallRegex = /\bsuper\b/;

	/**
	 * Return a new subclass, and register it to the array of `subclasses`.
	 *
	 * @param{function} builder Function used to build new instances of the
	 * subclass.
	 */
	object.subclass = function(builder) {
		var that = this;

		function klass(spec, my, notFinal) {
			spec = spec || {};
			my = my || {};

			if(klass.isAbstract && !notFinal) {
				throwAbstractClassError(that);
			}

			if(klass.isSingleton && !notFinal) {
				throwSingletonClassError(that);
			}

			var instance = that(spec, my, true);

			instance.getClass = function() {
				return klass;
			};

			var superInstance = Object.assign({}, instance);
			var superMy = Object.assign({}, my);

			klass.extensions.forEach(function(extension) {
				extension(instance, my);
			});

			builder(instance, my);
			if (superCallRegex.test(builder)) {
				installSuper(instance, superInstance);
				installSuper(my, superMy);
			}

			if (!notFinal) {
				my.initialize(spec);
			}

			return instance;
		}

		klass.superclass = that;
		klass.subclasses = [];
		that.subclasses.push(klass);

		// static inheritance
		klass.classBuilder = that.classBuilder;
		klass.classBuilder(klass);

		return klass;
	};

	object.singletonSubclass = function(builder) {
		var klass = this.subclass(builder);
		var instance = klass();
		klass.isSingleton = true;
		klass.instance = function() {
			return instance;
		};

		return klass;
	};

	object.abstractSubclass = function(builder) {
		var klass = this.subclass(builder);
		klass.isAbstract = true;
		return klass;
	};

	object.class = function(builder) {
		var that = this;

		if (that === object) {
			throw new Error("object class should not be extended.");
		}

		var superClassBuilder = that.classBuilder;
		that.classBuilder = function(klass) {
			superClassBuilder(klass);
			builder(klass);
		};

		that.classBuilder(that);
	};

	object.classBuilder = function(that) {
		// TODO: use Object.assign?
		that.class = object.class;
		that.subclass = object.subclass;
		that.singletonSubclass = object.singletonSubclass;
		that.abstractSubclass = object.abstractSubclass;
		that.allSubclasses = object.allSubclasses;
		that.subclassResponsibility = subclassResponsibility;
		that.extend = object.extend;
		that.extensions = [];
	};

	/**
	 * Mutate public functions of `obj` that make use of `super()` by binding
	 * `super` from within each public function of `obj` to the function in
	 * `proto`.
	 */
	function installSuper(obj, proto) {
		Object.keys(obj).forEach(function(name) {
			if (typeof proto[name] === "function" &&
				typeof obj[name] === "function" &&
				superCallRegex.test(obj[name]) &&
				!obj[name].superInstalled) {
				var superFn = proto[name];
				obj[name] = (function(name, fn) {
					return function() {
						var tmp = obj.super;
						obj.super = superFn;
						var returnValue = fn.apply(obj, arguments);
						obj.super = tmp;

						// We reached the top of the stack regarding super
						// calls, so cleanup the namespace.
						if (obj.super === undefined) {
							delete obj.super;
						}

						return returnValue;
					};
				})(name, obj[name]);
				obj[name].superInstalled = true;
			}
		});
	}

	/**
	 * Extend the class with new methods/properties.
	 * @param{function} builder takes the same arguments as
	 * `object.subclass`: `that`, `spec` and `my`.
	 */
	object.extend = function(builder) {
		this.extensions.push(builder);
	};

	function throwAbstractClassError(klass) {
		throw new Error("Cannot instantiate an instance of an abstract class");
	}

	function throwSingletonClassError(klass) {
		throw new Error("Cannot create new instances of a singleton class, use `instance` instead.");
	}

	/**
	 * Polyfill for Object.assign
	 */
	if (typeof Object.assign !== "function") {
		(function() {
			Object.assign = function(target) {
				if (target === undefined || target === null) {
					throw new TypeError("Cannot convert undefined or null to object");
				}

				var output = Object(target);
				for (var index = 1; index < arguments.length; index++) {
					var source = arguments[index];
					if (source !== undefined && source !== null) {
						for (var nextKey in source) {
							if (source.hasOwnProperty(nextKey)) {
								output[nextKey] = source[nextKey];
							}
						}
					}
				}
				return output;
			};
		})();
	}

	/**
	 * Helpers
	 */

	function capitalized(string) {
		return string[0].toUpperCase() + string.slice(1);
	}

	/**
	 * Throw an error when a method should have been overridden in a concrete
	 * subclass.
	 */
	function subclassResponsibility() {
		throw new Error("Subclass responsibility");
	}

	return object;
});

define('testCase',[
	"./object"
], function(object) {

	/**
	 * `testCase` implements an abstract test class, using Jasmine behind the
	 * scenes.
	 *
	 * All subclasses of testCase are singletons (so that one instance is
	 * created when the class is loaded).
	 */
	var testCase = object.abstractSubclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			var tests = my.registeredTests();
			suite(my.name(), function() {
				beforeEach(my.beforeEach);
				afterEach(my.afterEach);
				beforeAll(my.beforeAll);
				afterAll(my.afterAll);
				tests.forEach(function(test) {
					it(test.name, test.fn);
				});
			});
		};

		my.force = function() {
			return false;
		};

		my.beforeEach = function() {};
		my.beforeAll = function() {};
		my.afterEach = function() {};
		my.afterAll = function() {};

		my.name = function() {
			return my.subclassResponsibility;
		};

		my.expect = expect;
		my.spyOn = spyOn;

		my.registeredTests = function() {
			var result = [];
			var testRegex = /Test$/;

			Object.keys(my).forEach(function(name) {
				if (typeof my[name] === "function" &&
					testRegex.test(name)) {
					result.push({
						name: my.buildTestName(name),
						fn: my[name]
					});
				}
			});

			return result;
		};

		my.buildTestName = function(name) {
			name = name.slice(0, -4);
			var regexp = /([A-Z][^A-Z]*)/g;
			name = name.replace(regexp, " $1");
			name = name.toLowerCase();
			return name;
		};

		function suite(name, callback) {
			if (my.force()) {
				fdescribe(name, function() {
					callback();
				});
			} else {
				describe(name, function() {
					callback();
				});
			}
		}
	});

	testCase.class(function(that) {
		that.isTestCase = function() {
			return true;
		};

		// All test classes are singletons.
		// TODO: Refactor with a super call when we"ll have super on class-side.
		that.subclass = (function(superSubclass) {
			return function(builder) {
				var klass = superSubclass.apply(that, [builder]);
				var instance = klass();
				klass.isSingleton = true;
				klass.instance = function() {
					return instance;
				};

				return klass;
			};
		})(that.subclass);
	});

	return testCase;
});

define('propertiesEventEmitter',[
	"./object"
], function(object) {
	return object.subclass(function(that, my) {
		my.initialize = function(spec) {
			my.super(spec);
			my.instance = spec.instance;

			my.accessListeners = {};
			my.changeListeners = {};
		};

		that.onAccess = function(propName, listener) {
			if (!my.accessListeners[propName]) {
				my.accessListeners[propName] = [];
			}
			if (my.accessListeners[propName].indexOf(listener) === -1) {
				my.accessListeners[propName].push(listener);
			}
		};

		that.onChange = function(propName, listener) {
			if (!my.changeListeners[propName]) {
				my.changeListeners[propName] = [];
			}
			if (my.changeListeners[propName].indexOf(listener) === -1) {
				my.changeListeners[propName].push(listener);
			}
		};

		that.emitAccess = function(propName) {
			if (!my.accessListeners[propName]) {
				return;
			}

			my.accessListeners[propName].forEach(function(listener) {
				listener(my.instance, propName);
			});
		};

		that.emitChange = function(propName, value) {
			if (!my.changeListeners[propName]) {
				return;
			}

			my.changeListeners[propName].forEach(function(listener) {
				listener(my.instance, propName, value);
			});
		};
	});
});

define('globalPropertyEventEmitter',[
	"./object"
], function(object) {

	/**
	 * Central property events emitter.
	 *
	 * All properties will trigger events when accessed or changed.
	 */
	return object.singletonSubclass(function(that, my) {
		my.initialize = function(spec) {
			my.super(spec);
			my.accessListeners = [];
			my.changeListeners = [];
		};

		that.onAccess = function(listener) {
			my.accessListeners.push(listener);
		};

		that.onChange = function(listener) {
			my.changeListeners.push(listener);
		};

		that.emitAccess = function(instance, propName) {
			my.accessListeners.forEach(function(listener) {
				listener(instance, propName);
			});
		};

		that.emitChange = function(instance, propName, value) {
			my.changeListeners.forEach(function(listener) {
				listener(instance, propName, value);
			});
		};
	});
});

define('property',[
	"./object",
	"./propertiesEventEmitter",
	"./globalPropertyEventEmitter"
], function(object, propertiesEventEmitter, globalPropertyEventEmitter) {
	/**
	 * A property represent an observable attribute of an object, with optional
	 * getters and setters.
	 *
	 * @param{string} spec.owner - Instance on which the property is installed.
	 * @param{string} spec.name - Name of the property, which value of the same
	 * name is installed on `my` on the instance.
	 z     */
	object.extend(function(that, my) {

		that.onPropertyAccess = function(propName, listener) {
			var emitter = my.ensurePropertiesEventEmitter();
			emitter.onAccess(propName, listener);
		};

		that.onPropertyChange = function(propName, listener) {
			var emitter = my.ensurePropertiesEventEmitter();
			emitter.onChange(propName, listener);
		};

		my.property = function(propName, initialValue) {
			var value = initialValue;
			Object.defineProperty(my, propName, {
				configurable: true,
				enumerable: true,
				get: function() {
					emitPropertyAccess(propName);
					return value;
				},
				set: function(newValue) {
					value = newValue;
					emitPropertyChange(propName, value);
				}
			});
		};

		my.ensurePropertiesEventEmitter = function() {
			if (my.propertiesEventEmitter) {
				return my.propertiesEventEmitter;
			}

			my.propertiesEventEmitter = propertiesEventEmitter({
				instance: that
			});

			return my.propertiesEventEmitter;
		};

		function emitPropertyAccess(propName) {
			var emitter = my.ensurePropertiesEventEmitter();
			emitter.emitAccess(propName);
			globalPropertyEventEmitter.instance().emitAccess(that, propName);
		}

		function emitPropertyChange(propName, value) {
			var emitter = my.ensurePropertiesEventEmitter();
			emitter.emitChange(propName, value);
			globalPropertyEventEmitter.instance().emitChange(that, propName, value);
		}
	});
});

define('klassified',[
	"./object",
	"./testCase",
	"./property",
	"./globalPropertyEventEmitter"
], function(object, testCase, property, propertyEventEmitter) {
	return {
		object: object,
		testCase: testCase,
		property: property,
		propertyEventEmitter: propertyEventEmitter
	};
});


require(["klassified"]);
    return require("klassified");
}));

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.klassified = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _object = require("./object");

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Central property events emitter.
 *
 * All properties will trigger events when accessed or changed.
 */
exports.default = _object2.default.singletonSubclass(function (that, my) {
	my.initialize = function (spec) {
		my.super(spec);
		my.accessListeners = [];
		my.changeListeners = [];
	};

	that.onAccess = function (listener) {
		my.accessListeners.push(listener);
	};

	that.onChange = function (listener) {
		my.changeListeners.push(listener);
	};

	that.emitAccess = function (instance, propName) {
		my.accessListeners.forEach(function (listener) {
			listener(instance, propName);
		});
	};

	that.emitChange = function (instance, propName, value) {
		my.changeListeners.forEach(function (listener) {
			listener(instance, propName, value);
		});
	};
});

},{"./object":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.propertyEventEmitter = exports.testCase = exports.object = undefined;

var _object = require("./object");

var _object2 = _interopRequireDefault(_object);

var _testCase = require("./testCase");

var _testCase2 = _interopRequireDefault(_testCase);

var _globalPropertyEventEmitter = require("./globalPropertyEventEmitter");

var _globalPropertyEventEmitter2 = _interopRequireDefault(_globalPropertyEventEmitter);

require("./property");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.object = _object2.default;
exports.testCase = _testCase2.default;
exports.propertyEventEmitter = _globalPropertyEventEmitter2.default;
exports.default = {
	object: _object2.default,
	testCase: _testCase2.default,
	propertyEventEmitter: _globalPropertyEventEmitter2.default
};

},{"./globalPropertyEventEmitter":1,"./object":3,"./property":5,"./testCase":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * `object` is the base class of the object model.
 * It provides facilities to create subclasses and common methods.
 *
 * @example Basic usage
 *
 * Creating subclasses & using inheritance:
 *
 *    let animal = object.subclass(function(that, my) {
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
 *    let dog = animal.subclass(function(that, my) {
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
 *    let milou = dog({name: milou});
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

	that.getClass = function () {
		return object;
	};

	/**
  * preInitialize is called by the framework at the beginning
  * of object instantiation.
  */
	my.preInitialize = function () {};

	/**
  * initialize is called by the framework upon object instantiation.
  */
	my.initialize = function () {};

	/**
  * postInitialize is called by the framework at the end of
  * object instantiation.
  */
	my.postInitialize = function () {};

	/**
  * Throws an error because the method should have been overridden.
  */
	my.subclassResponsibility = subclassResponsibility;

	/**
  * Getter/Setter generation
  */
	my.get = function (propName, getter) {
		if (!getter) {
			getter = function getter() {
				return my[propName];
			};
		}
		that["get" + capitalized(propName)] = getter;
	};

	my.set = function (propName, setter) {
		if (!setter) {
			setter = function setter(value) {
				my[propName] = value;
				return value;
			};
		}
		that["set" + capitalized(propName)] = setter;
	};

	// install extensions by hand for object, since we do not have the
	// extension installation of the subclasses
	that.getClass().extensions.forEach(function (extension) {
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
object.allSubclasses = function () {
	var allSubclasses = this.subclasses.slice();
	this.subclasses.forEach(function (klass) {
		klass.allSubclasses().forEach(function (subclass) {
			allSubclasses.push(subclass);
		});
	});
	return allSubclasses;
};

/**
 * Return all concrete subclasses.
 */
object.allConcreteSubclasses = function () {
	var allConcreteSubclasses = this.subclasses.filter(function (klass) {
		return !klass.isAbstract;
	});

	this.subclasses.forEach(function (klass) {
		klass.allConcreteSubclasses().forEach(function (subclass) {
			allConcreteSubclasses.push(subclass);
		});
	});

	return allConcreteSubclasses;
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
object.subclass = function (builder) {
	var that = this;

	function klass(spec, my, notFinal) {
		spec = spec || {};
		my = my || {};

		if (klass.isAbstract && !notFinal) {
			throwAbstractClassError(that);
		}

		if (klass.isSingleton && !notFinal) {
			throwSingletonClassError(that);
		}

		var instance = that(spec, my, true);

		instance.getClass = function () {
			return klass;
		};

		var superInstance = Object.assign({}, instance);
		var superMy = Object.assign({}, my);

		klass.extensions.forEach(function (extension) {
			extension(instance, my);
		});

		builder(instance, my);

		if (superCallRegex.test(builder)) {
			installSuper(my, superMy, klass, "my");
			installSuper(instance, superInstance, klass, "that");
		}

		if (!notFinal) {
			my.preInitialize(spec);
			my.initialize(spec);
			my.postInitialize(spec);
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

object.singletonSubclass = function (builder) {
	var klass = this.subclass(builder);
	var instance = klass();
	klass.isSingleton = true;
	klass.instance = function () {
		return instance;
	};

	return klass;
};

object.abstractSubclass = function (builder) {
	var klass = this.subclass(builder);
	klass.isAbstract = true;
	return klass;
};

object.class = function (builder) {
	var that = this;

	if (that === object) {
		throw new Error("object class should not be extended.");
	}

	var superClassBuilder = that.classBuilder;
	that.classBuilder = function (klass) {
		superClassBuilder(klass);
		builder(klass);
	};

	that.classBuilder(that);
};

object.classBuilder = function (that) {
	// TODO: use Object.assign?
	that.class = object.class;
	that.subclass = object.subclass;
	that.singletonSubclass = object.singletonSubclass;
	that.abstractSubclass = object.abstractSubclass;
	that.allSubclasses = object.allSubclasses;
	that.allConcreteSubclasses = object.allConcreteSubclasses;
	that.subclassResponsibility = subclassResponsibility;
	that.extend = object.extend;
	that.extensions = [];
};

/**
 * Mutate public functions of `obj` that make use of `super()` by binding
 * `super` from within each public function of `obj` to the function in
 * `proto`.
 */
function installSuper(obj, proto, klass, receiverName) {
	methodsWithSuperCall(obj, proto, klass, receiverName).forEach(function (name) {
		if (!obj[name].superInstalled) {
			obj[name] = function (obj, fn, superFn) {
				return function () {

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
			}(obj, obj[name], proto[name]);
			obj[name].superInstalled = true;
		}
	});
}

/**
 * Return the list of methods in `obj` that perform a supercall to `proto`.
 * The list is cached in `klass`.
 *
 * `receiverName` is either "that" or "my".
 */
function methodsWithSuperCall(obj, proto, klass, receiverName) {
	if (!klass.methodsWithSuperCall) {
		Object.defineProperty(klass, "methodsWithSuperCall", {
			enumerable: false,
			writable: true,
			value: {}
		});
	}

	if (klass.methodsWithSuperCall[receiverName]) {
		return klass.methodsWithSuperCall[receiverName];
	}

	klass.methodsWithSuperCall[receiverName] = Object.keys(obj).filter(function (name) {
		return typeof proto[name] === "function" && typeof obj[name] === "function" && superCallRegex.test(obj[name]);
	});

	return klass.methodsWithSuperCall[receiverName];
}

/**
 * Extend the class with new methods/properties.
 * @param{function} builder takes the same arguments as
 * `object.subclass`: `that`, `spec` and `my`.
 */
object.extend = function (builder) {
	this.extensions.push(builder);
};

function throwAbstractClassError(klass) {
	throw new Error("Cannot instantiate an abstract class");
}

function throwSingletonClassError(klass) {
	throw new Error("Cannot create new instances of a singleton class, use `instance` instead.");
}

/**
 * Polyfill for Object.assign
 */
if (typeof Object.assign !== "function") {
	(function () {
		Object.assign = function (target) {
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

exports.default = object;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _object = require("./object");

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _object2.default.subclass(function (that, my) {
	my.initialize = function (spec) {
		my.super(spec);
		my.instance = spec.instance;

		my.accessListeners = {};
		my.changeListeners = {};
	};

	that.onAccess = function (propName, listener) {
		if (!my.accessListeners[propName]) {
			my.accessListeners[propName] = [];
		}
		if (my.accessListeners[propName].indexOf(listener) === -1) {
			my.accessListeners[propName].push(listener);
		}
	};

	that.onChange = function (propName, listener) {
		if (!my.changeListeners[propName]) {
			my.changeListeners[propName] = [];
		}
		if (my.changeListeners[propName].indexOf(listener) === -1) {
			my.changeListeners[propName].push(listener);
		}
	};

	that.emitAccess = function (propName) {
		if (!my.accessListeners[propName]) {
			return;
		}

		my.accessListeners[propName].forEach(function (listener) {
			listener(my.instance, propName);
		});
	};

	that.emitChange = function (propName, value) {
		if (!my.changeListeners[propName]) {
			return;
		}

		my.changeListeners[propName].forEach(function (listener) {
			listener(my.instance, propName, value);
		});
	};
});

},{"./object":3}],5:[function(require,module,exports){
"use strict";

var _object = require("./object");

var _object2 = _interopRequireDefault(_object);

var _propertiesEventEmitter = require("./propertiesEventEmitter");

var _propertiesEventEmitter2 = _interopRequireDefault(_propertiesEventEmitter);

var _globalPropertyEventEmitter = require("./globalPropertyEventEmitter");

var _globalPropertyEventEmitter2 = _interopRequireDefault(_globalPropertyEventEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A property represent an observable attribute of an object, with optional
 * getters and setters.
 *
 * @param{string} spec.owner - Instance on which the property is installed.
 * @param{string} spec.name - Name of the property, which value of the same
 * name is installed on `my` on the instance.
 */
_object2.default.extend(function (that, my) {
	that.onPropertyAccess = function (propName, listener) {
		var emitter = my.ensurePropertiesEventEmitter();
		emitter.onAccess(propName, listener);
	};

	that.onPropertyChange = function (propName, listener) {
		var emitter = my.ensurePropertiesEventEmitter();
		emitter.onChange(propName, listener);
	};

	my.property = function (propName, initialValue) {
		var value = initialValue;
		Object.defineProperty(my, propName, {
			configurable: true,
			enumerable: true,
			get: function get() {
				emitPropertyAccess(propName);
				return value;
			},
			set: function set(newValue) {
				value = newValue;
				emitPropertyChange(propName, value);
			}
		});
	};

	my.ensurePropertiesEventEmitter = function () {
		if (my.propertiesEventEmitter) {
			return my.propertiesEventEmitter;
		}

		my.propertiesEventEmitter = (0, _propertiesEventEmitter2.default)({
			instance: that
		});

		return my.propertiesEventEmitter;
	};

	function emitPropertyAccess(propName) {
		var emitter = my.ensurePropertiesEventEmitter();
		emitter.emitAccess(propName);
		_globalPropertyEventEmitter2.default.instance().emitAccess(that, propName);
	}

	function emitPropertyChange(propName, value) {
		var emitter = my.ensurePropertiesEventEmitter();
		emitter.emitChange(propName, value);
		_globalPropertyEventEmitter2.default.instance().emitChange(that, propName, value);
	}
});

},{"./globalPropertyEventEmitter":1,"./object":3,"./propertiesEventEmitter":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _object = require("./object");

var _object2 = _interopRequireDefault(_object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `testCase` implements an abstract test class, using Jasmine behind the
 * scenes.
 *
 * All subclasses of testCase are singletons (so that one instance is
 * created when the class is loaded).
 */
var testCase = _object2.default.abstractSubclass(function (that, my) {

	my.initialize = function (spec) {
		my.super(spec);
		var tests = my.registeredTests();
		suite(my.name(), function () {
			beforeEach(my.beforeEach);
			afterEach(my.afterEach);
			beforeAll(my.beforeAll);
			afterAll(my.afterAll);
			tests.forEach(function (test) {
				it(test.name, test.fn);
			});
		});
	};

	my.force = function () {
		return false;
	};

	my.beforeEach = function () {};
	my.beforeAll = function () {};
	my.afterEach = function () {};
	my.afterAll = function () {};

	my.name = function () {
		return my.subclassResponsibility();
	};

	my.expect = expect;
	my.spyOn = spyOn;

	my.registeredTests = function () {
		var result = [];
		var testRegex = /Test$/;

		Object.keys(my).forEach(function (name) {
			if (typeof my[name] === "function" && testRegex.test(name)) {
				result.push({
					name: my.buildTestName(name),
					fn: my[name]
				});
			}
		});

		return result;
	};

	my.buildTestName = function (name) {
		name = name.slice(0, -4);
		var regexp = /([A-Z][^A-Z]*)/g;
		name = name.replace(regexp, " $1");
		name = name.toLowerCase();
		return name;
	};

	function suite(name, callback) {
		if (my.force()) {
			fdescribe(name, function () {
				// eslint-disable-line jasmine/no-focused-tests
				callback();
			});
		} else {
			describe(name, function () {
				callback();
			});
		}
	}
}); /* eslint jasmine/no-global-setup: 0 */


testCase.class(function (that) {
	that.isTestCase = function () {
		return true;
	};

	// All test classes are singletons.
	// TODO: Refactor with a super call when we"ll have super on class-side.
	that.subclass = function (superSubclass) {
		return function (builder, options) {
			var klass = superSubclass.apply(that, [builder]);

			if (options && options.isAbstract) {
				return klass;
			}

			var instance = klass();
			klass.isSingleton = true;
			klass.instance = function () {
				return instance;
			};

			return klass;
		};
	}(that.subclass);

	// We need this to ensure we don't have abstract & singleton classes
	that.abstractSubclass = function (superAbstractSubclass) {
		return function (builder) {
			var klass = this.subclass(builder, { isAbstract: true });
			klass.isAbstract = true;
			return klass;
		};
	}(that.abstractSubclass);
});

exports.default = testCase;

},{"./object":3}]},{},[2])(2)
});

//# sourceMappingURL=klassified.js.map

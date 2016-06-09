define([
], function() {

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
	 *            return 'dog ' + that.super();
	 *        };
	 *
	 *        that.say = function(something) {
	 *            return 'Woof Woof, ' + something;
	 *        };
	 *    });
	 *
	 * Creating instances:
	 *
	 *    var milou = dog({name: milou});
	 *    milou.say('hello Tintin'); // => 'Woof Woof, hello Tintin'
	 *    milou.getName(); // => 'dog milou'
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
			that['get' + capitalized(propName)] = getter;
		};

		my.set = function(propName, setter) {
			if(!setter) {
				setter = function(value) {
					my[propName] = value;
					return value;
				};
			}
			that['set' + capitalized(propName)] = setter;
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
			if(superCallRegex.test(builder)) {
				installSuper(instance, superInstance);
				installSuper(my, superMy);
			}

			if(!notFinal) {
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

	object.abstractSubclass = function(builder) {
		var klass = object.subclass(builder);
		klass.isAbstract = true;
		return klass;
	};

	object.class = function(builder) {
		var that = this;

		if(that === object) {
			throw new Error('object class should not be extended.');
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
		throw new Error('Cannot instantiate an instance of an abstract class');
	}

	/**
	 * Polyfill for Object.assign
	 */
	if (typeof Object.assign != 'function') {
		(function () {
			Object.assign = function (target) {
				'use strict';
				if (target === undefined || target === null) {
					throw new TypeError('Cannot convert undefined or null to object');
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

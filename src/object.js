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
	 *    var animal = object.subclass(function(that, spec, my) {
	 *
	 *        that.initialize = function() {
	 *            my.name = spec.name;
	 *        };
	 *
	 *        that.getName = function() {
	 *            return my.name;
	 *        };
	 *
	 *        that.say = function(something) {
	 *            that.subclassResponsibility();
	 *        };
	 *    });
	 *
	 *
	 *    var dog = animal.subclass(function(that, spec, my) {
	 *
	 *        that.getName = function() {
	 *            return 'dog ' + that.super.getName();
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
	 *    milou.say('hello Tintin'); ;; => 'Woof Woof, hello Tintin'
	 *
	 * @param{{}} spec
	 * @param{{}} my
	 * @return {object}
	 */
	function object(spec, my) {
		spec = spec || {};
		my = my || {};

		var that = {};

		that.klass = object;

		/**
		 * initialize is called by the framework upon object instantiation.
		 */
		my.initialize = function() {};

		/**
		 * Throws an error because the method should have been overridden.
		 */
		that.subclassResponsibility = function() {
			throw new Error("Subclass responsibility");
		};

		// install extensions by hand for object, since we do not have the
		// extension installation of the subclasses
		that.klass.extensions.forEach(function(extension) {
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

			var instance = that(spec, my, true);

			instance.class = klass;

			// access to super for public and protected properties.
			var superInstance = Object.assign({}, instance);
			var superMy = Object.assign({}, my);

			that.extensions.forEach(function(extension) {
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

		// static inheritance
		Object.assign(klass, that);

		klass.subclasses = [];
		that.subclasses.push(klass);

		return klass;
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
				superCallRegex.test(obj[name])) {
				var superFn = proto[name];
				obj[name] = (function(name, fn) {
					return function() {
						var tmp = obj.super;
						obj.super = superFn;
						var returnValue = fn.apply(obj, arguments);
						obj.super = tmp;

						return returnValue;
					};
				})(name, obj[name]);
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

	return object;
});

define([
	"./objectClass",
	"./polyfills"
], function(objectClass) {
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
	var object = objectClass.new();
	object.new = function(spec, my) {
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
			if (!getter) {
				getter = function() {
					return my[propName];
				};
			}
			that["get" + capitalized(propName)] = getter;
		};

		my.set = function(propName, setter) {
			if (!setter) {
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
	};

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

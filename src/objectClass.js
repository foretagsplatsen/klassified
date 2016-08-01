define([
	"./class"
], function(classModel) {
	var superCallRegex = /\bsuper\b/;

	/**
	 * objectClass is the meta class of the class `object`
	 * @type {{}}
	 */
	var objectClass = classModel.new();
	objectClass.name = "objectClass";
	objectClass.classBuilder = function() {

	};

	objectClass.new = function() {
		var that = {};

		var metaclass = this;
		that.subclasses = [];

		/**
		 * Return an array of all extensions of the class, see `object.extend`.
		 */
		that.extensions = [];

		that.getSubclasses = function() {
			return this.subclasses;
		};

		that.allSubclasses = function() {
			var allSubclasses = this.getSubclasses().slice();
			this.getSubclasses().forEach(function(klass) {
				klass.allSubclasses().forEach(function(subclass) {
					allSubclasses.push(subclass);
				});
			});
			return allSubclasses;
		};

		that.class = function(builder) {
			var that = this;

			if (that.getClass() === objectClass) {
				throw new Error("object class should not be extended.");
			}

			builder(that);
			that.getClass().extensions.push(builder);

			if (superCallRegex.test(builder)) {
				installSuper(that, that.superclass);
			}
		};

		that.abstractSubclass = function(builder) {
			var klass = this.subclass(builder);
			klass.isAbstract = true;
			return klass;
		};

		that.singletonSubclass = function(builder) {
			var klass = this.subclass(builder);
			var instance = klass.new();
			klass.isSingleton = true;
			klass.instance = function() {
				return instance;
			};

			return klass;
		};

		/**
		 * Extend the class with new methods/properties.
		 * @param{function} builder takes the same arguments as
		 * `object.subclass`: `that`, `spec` and `my`.
		 */
		that.extend = function(builder) {
			this.extensions.push(builder);
		};

		/**
		 * Return a new subclass, and register it to the array of `subclasses`.
		 *
		 * @param{function} builder Function used to build new instances of the
		 * subclass.
		 */
		that.subclass = function(builder) {
			var superClass = this;

			var superMetaClass = superClass.getClass();
			var metaClass = superMetaClass.subclass();

			var klass = metaClass.new();

			klass.new = function(spec, my, notFinal) {
				spec = spec || {};
				my = my || {};

				if (klass.isAbstract && !notFinal) {
					throwAbstractClassError(superClass);
				}

				if (klass.isSingleton && !notFinal) {
					throwSingletonClassError(superClass);
				}

				var instance = superClass.new(spec, my, true);

				instance.getClass = function() {
					return klass;
				};

				var superInstance = Object.assign({}, instance);
				var superMy = Object.assign({}, my);

				klass.extensions.forEach(function(extension) {
					extension(instance, my);
				});

				if (builder) {
					builder(instance, my);
				}

				if (superCallRegex.test(builder)) {
					installSuper(instance, superInstance);
					installSuper(my, superMy);
				}

				if (!notFinal) {
					my.initialize(spec);
				}

				return instance;
			};

			klass.superclass = superClass;
			klass.subclasses = [];
			superClass.subclasses.push(klass);

			return klass;
		};

		that.getClass = function() {
			return metaclass;
		};

		return that;
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
				superCallRegex.test(obj[name]) && !obj[name].superInstalled) {
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

	function throwAbstractClassError(klass) {
		throw new Error("Cannot instantiate an instance of an abstract class");
	}

	function throwSingletonClassError(klass) {
		throw new Error("Cannot create new instances of a singleton class, use `instance` instead.");
	}

	return objectClass;
});

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
	spec ||= {};
	my ||= {};

	let that = {};

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
		getter ||= function () {
			return my[propName];
		};

		that[`get${capitalized(propName)}`] = getter;
	};

	my.set = function (propName, setter) {
		setter ||= function (value) {
			my[propName] = value;
			return value;
		};

		that[`set${capitalized(propName)}`] = setter;
	};

	// install extensions by hand for object, since we do not have the
	// extension installation of the subclasses
	that.getClass().extensions.forEach((extension) => {
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
	let allSubclasses = this.subclasses.slice();

	this.subclasses.forEach((klass) => {
		klass.allSubclasses().forEach((subclass) => {
			allSubclasses.push(subclass);
		});
	});

	return allSubclasses;
};

/**
 * Return all concrete subclasses.
 */
object.allConcreteSubclasses = function () {
	let allConcreteSubclasses = this.subclasses.filter(
		(klass) => !klass.isAbstract,
	);

	this.subclasses.forEach((klass) => {
		klass.allConcreteSubclasses().forEach((subclass) => {
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

let superCallRegex = /\bsuper\b/;

/**
 * Return a new subclass, and register it to the array of `subclasses`.
 *
 * @param{function} builder Function used to build new instances of the
 * subclass.
 */
object.subclass = function (builder) {
	let that = this;

	function klass(spec, my, notFinal) {
		spec ||= {};
		my ||= {};

		if (klass.isAbstract && !notFinal) {
			throwAbstractClassError(that);
		}

		if (klass.isSingleton && !notFinal) {
			throwSingletonClassError(that);
		}

		let instance = that(spec, my, true);

		instance.getClass = function () {
			return klass;
		};

		let superInstance = { ...instance };
		let superMy = { ...my };

		klass.extensions.forEach((extension) => {
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
	let klass = this.subclass(builder);
	let instance = klass();
	klass.isSingleton = true;

	klass.instance = function () {
		return instance;
	};

	return klass;
};

object.abstractSubclass = function (builder) {
	let klass = this.subclass(builder);
	klass.isAbstract = true;
	return klass;
};

object.class = function (builder) {
	let that = this;

	if (that === object) {
		throw new Error("object class should not be extended.");
	}

	let superClassBuilder = that.classBuilder;

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
	methodsWithSuperCall(obj, proto, klass, receiverName).forEach((name) => {
		if (!obj[name].superInstalled) {
			obj[name] = (function (obj, fn, superFn) {
				return function () {
					let tmp = obj.super;
					obj.super = superFn;
					let returnValue = fn.apply(obj, arguments);
					obj.super = tmp;

					// We reached the top of the stack regarding super
					// calls, so cleanup the namespace.
					if (obj.super === undefined) {
						delete obj.super;
					}

					return returnValue;
				};
			})(obj, obj[name], proto[name]);

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
			value: {},
		});
	}

	if (klass.methodsWithSuperCall[receiverName]) {
		return klass.methodsWithSuperCall[receiverName];
	}

	klass.methodsWithSuperCall[receiverName] = Object.keys(obj).filter(
		(name) =>
			typeof proto[name] === "function" &&
			typeof obj[name] === "function" &&
			superCallRegex.test(obj[name]),
	);

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
	throw new Error(
		"Cannot create new instances of a singleton class, use `instance` instead.",
	);
}

/**
 * Polyfill for Object.assign
 */
if (typeof Object.assign !== "function") {
	(function () {
		Object.assign = function (target) {
			if (target === undefined || target === null) {
				throw new TypeError(
					"Cannot convert undefined or null to object",
				);
			}

			let output = new Object(target);
			for (let index = 1; index < arguments.length; index++) {
				let source = arguments[index];
				if (source !== undefined && source !== null) {
					for (let nextKey in source) {
						if (
							Object.prototype.hasOwnProperty.call(
								source,
								nextKey,
							)
						) {
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

export default object;

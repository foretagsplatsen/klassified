define([], function() {
	var classModel = {};

	// Return a new metaclass
	classModel.new = function() {
		var that = {};

		that.subclasses = [];
		that.extensions = [];

		that.getClass = function() {
			return null;
		};

		that.subclass = function() {
			var superClass = this;
			var klass = classModel.new();

			klass.new = function(notFinal) {
				if (klass.isAbstract && !notFinal) {
					throwAbstractClassError(superClass);
				}

				if (klass.isSingleton && !notFinal) {
					throwSingletonClassError(superClass);
				}

				var instance = superClass.new(true);

				instance.getClass = function() {
					return klass;
				};

				klass.extensions.forEach(function(extension) {
					extension(instance);
				});

				return instance;
			};

			klass.superclass = superClass;
			klass.subclasses = [];
			superClass.subclasses.push(klass);
			klass.extensions = [];
			klass.proto = {};

			return klass;
		};

		that.proto = {};
		return that;
	};

	function throwAbstractClassError(klass) {
		throw new Error("Cannot instantiate an instance of an abstract class");
	}

	function throwSingletonClassError(klass) {
		throw new Error("Cannot create new instances of a singleton class, use `instance` instead.");
	}

	return classModel;
});

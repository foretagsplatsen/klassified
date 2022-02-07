import object from "../../src/object.js";

describe("class-inheritance", function() {

	it("Cannot add class-side methods to Object", function() {
		let exception;
		try {
			object.class(function(that) {
				that.foo = function() {
					return true;
				};
			});
		} catch (e) {
			exception = true;
		}

		expect(exception).toBe(true);
	});

	it("Class-side methods are inherited in direct subclasses", function() {
		let animal = object.subclass(function() {
		});
		animal.class(function(that) {
			that.bar = function() {
				return true;
			};
		});

		let dog = animal.subclass(function() {
		});

		expect(dog.bar()).toBe(true);
	});

	it("Class-side methods are not propagated to the superclass", function() {
		let animal = object.subclass(function() {
		});
		animal.class(function(that) {
			that.bar = function() {
				return true;
			};
		});

		let dog = animal.subclass(function() {
		});
		dog.class(function(that) {
			that.baz = function() {
				return true;
			};
		});

		expect(object.bar).toEqual(undefined);
		expect(animal.baz).toEqual(undefined);
	});

	it("Class-side method reference the correct class when inherited", function() {
		let animal = object.subclass(function() {
		});
		animal.class(function(that) {
			that.foo = function() {
				return that.bar();
			};

			that.bar = function() {
				return false;
			};
		});

		let dog = animal.subclass(function() {
		});
		dog.class(function(that) {
			that.bar = function() {
				return true;
			};
		});

		expect(dog.foo()).toBe(true);
	});

	it("Custom constructors instantiate objects of the correct class", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.name = spec.name;
			};

			that.getName = function() {
				return my.name;
			};
		});

		animal.class(function(that) {
			that.named = function(name) {
				return that({
					name: name
				});
			};
		});

		let dog = animal.subclass(function() {
		});

		expect(dog.named("milou").getClass()).toEqual(dog);
		expect(animal.named("babar").getClass()).toEqual(animal);
	});
});

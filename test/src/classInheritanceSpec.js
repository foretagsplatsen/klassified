import object from "../../src/object.js";

describe("class-inheritance", () => {
	it("Cannot add class-side methods to Object", () => {
		let exception;
		try {
			object.class((that) => {
				that.foo = function () {
					return true;
				};
			});
		} catch {
			exception = true;
		}

		expect(exception).toBe(true);
	});

	it("Class-side methods are inherited in direct subclasses", () => {
		let animal = object.subclass(() => {});

		animal.class((that) => {
			that.bar = function () {
				return true;
			};
		});

		let dog = animal.subclass(() => {});

		expect(dog.bar()).toBe(true);
	});

	it("Class-side methods are not propagated to the superclass", () => {
		let animal = object.subclass(() => {});

		animal.class((that) => {
			that.bar = function () {
				return true;
			};
		});

		let dog = animal.subclass(() => {});

		dog.class((that) => {
			that.baz = function () {
				return true;
			};
		});

		expect(object.bar).toEqual(undefined);
		expect(animal.baz).toEqual(undefined);
	});

	it("Class-side method reference the correct class when inherited", () => {
		let animal = object.subclass(() => {});

		animal.class((that) => {
			that.foo = function () {
				return that.bar();
			};

			that.bar = function () {
				return false;
			};
		});

		let dog = animal.subclass(() => {});

		dog.class((that) => {
			that.bar = function () {
				return true;
			};
		});

		expect(dog.foo()).toBe(true);
	});

	it("Custom constructors instantiate objects of the correct class", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.name = spec.name;
			};

			that.getName = function () {
				return my.name;
			};
		});

		animal.class((that) => {
			that.named = function (name) {
				return that({
					name,
				});
			};
		});

		let dog = animal.subclass(() => {});

		expect(dog.named("milou").getClass()).toEqual(dog);
		expect(animal.named("babar").getClass()).toEqual(animal);
	});
});

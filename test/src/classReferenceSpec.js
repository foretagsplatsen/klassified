import object from "../../src/object.js";

describe("class-reference", () => {
	it("Instance of object can access their class", () => {
		let o = object();

		expect(o.getClass()).toEqual(object);
	});

	it("Instances of subclasses of object reference the correct class", () => {
		let animal = object.subclass((that, my) => {});

		let a = animal();

		expect(a.getClass()).toEqual(animal);
	});

	it("Instances of subclasses of subclasses refer to the correct class", () => {
		let animal = object.subclass((that, my) => {});
		let dog = animal.subclass((that, my) => {});

		let d = dog();

		expect(d.getClass()).toEqual(dog);
	});

	it("Can refer to class-side methods from an instance", () => {
		let animal = object.subclass((that, my) => {
			that.foo = function () {
				return that.getClass().foo();
			};
		});

		animal.class((that) => {
			that.foo = function () {
				return true;
			};
		});

		let a = animal();

		expect(a.foo()).toBe(true);
	});
});

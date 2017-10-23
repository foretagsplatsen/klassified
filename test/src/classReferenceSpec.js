import object from "../../src/object";

describe("class-reference", function() {

	it("Instance of object can access their class", function() {
		let o = object();

		expect(o.getClass()).toEqual(object);
	});

	it("Instances of subclasses of object reference the correct class", function() {
		let animal = object.subclass(function(that, my) {
		});

		let a = animal();

		expect(a.getClass()).toEqual(animal);
	});

	it("Instances of subclasses of subclasses refer to the correct class", function() {
		let animal = object.subclass(function(that, my) {
		});
		let dog = animal.subclass(function(that, my) {
		});

		let d = dog();

		expect(d.getClass()).toEqual(dog);
	});

	it("Can refer to class-side methods from an instance", function() {
		let animal = object.subclass(function(that, my) {
			that.foo = function() {
				return that.getClass().foo();
			};
		});

		animal.class(function(that) {
			that.foo = function() {
				return true;
			};
		});

		let a = animal();

		expect(a.foo()).toBe(true);
	});
});

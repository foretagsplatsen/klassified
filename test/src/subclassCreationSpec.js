import object from "../../src/object.js";

describe("subclass creation", function () {
	it("Can create a subclass", function () {
		let animal = object.subclass(function () {});

		expect(object.subclasses).toContain(animal);
	});

	it("Can create a subclass of a subclass", function () {
		let animal = object.subclass(function () {});
		let dog = animal.subclass(function () {});

		expect(animal.subclasses).toEqual([dog]);
	});
});

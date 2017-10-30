import object from "../../src/object";

describe("allSubclasses", function() {
	it("Can get all subclasses of a class", function() {
		let animal = object.subclass(function() {});
		let dog = animal.subclass(function() {});
		let shepherd = dog.subclass(function() {});
		let cat = animal.subclass(function() {});

		expect(animal.allSubclasses()).toEqual([dog, cat, shepherd]);
	});
});

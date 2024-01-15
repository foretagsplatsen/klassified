import object from "../../src/object.js";

describe("allSubclasses", () => {
	it("Can get all subclasses of a class", () => {
		let animal = object.subclass(() => {});
		let dog = animal.subclass(() => {});
		let shepherd = dog.subclass(() => {});
		let cat = animal.subclass(() => {});

		expect(animal.allSubclasses()).toEqual([dog, cat, shepherd]);
	});
});

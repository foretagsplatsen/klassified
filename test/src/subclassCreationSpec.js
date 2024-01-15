import object from "../../src/object.js";

describe("subclass creation", () => {
	it("Can create a subclass", () => {
		let animal = object.subclass(() => {});

		expect(object.subclasses).toContain(animal);
	});

	it("Can create a subclass of a subclass", () => {
		let animal = object.subclass(() => {});
		let dog = animal.subclass(() => {});

		expect(animal.subclasses).toEqual([dog]);
	});
});

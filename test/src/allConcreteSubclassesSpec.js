import object from "../../src/object.js";

describe("allConcreteSubclasses", () => {
	it("Can get all concrete subclasses of a class", () => {
		let a = object.abstractSubclass(() => {});
		let b = a.abstractSubclass(() => {});
		let c = a.subclass(() => {});
		let d = b.subclass(() => {});
		let e = d.abstractSubclass(() => {});
		let f = e.subclass(() => {});

		expect(a.allConcreteSubclasses()).toEqual([c, d, f]);
	});
});

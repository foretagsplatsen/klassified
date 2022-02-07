import object from "../../src/object.js";

describe("allConcreteSubclasses", function() {
	it("Can get all concrete subclasses of a class", function() {
		let a = object.abstractSubclass(function() {});
		let b = a.abstractSubclass(function() {});
		let c = a.subclass(function() {});
		let d = b.subclass(function() {});
		let e = d.abstractSubclass(function() {});
		let f = e.subclass(function() {});

		expect(a.allConcreteSubclasses()).toEqual([c, d, f]);
	});
});

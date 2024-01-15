import object from "../../src/object.js";

describe("abstract subclass", () => {
	it("Can create abstract subclasses", () => {
		function builder() {
			object.abstractSubclass((that, my) => {});
		}

		expect(builder).not.toThrow();
	});

	it("Cannot instantiate abstract classes", () => {
		let abstractClass = object.abstractSubclass((that, my) => {});

		expect(abstractClass).toThrow();
	});

	it("Abstract classes should be abstract", () => {
		let abstractClass = object.abstractSubclass((that, my) => {});

		expect(abstractClass.isAbstract).toBeTruthy();
	});

	it("Can subclass abstract classes", () => {
		let abstractClass = object.abstractSubclass((that, my) => {});
		let concreteSubclass = abstractClass.subclass((that, my) => {});

		expect(concreteSubclass).not.toThrow();
	});

	it("Can create abstract subclasses of abstract classes", () => {
		let abstractClass = object.abstractSubclass((that, my) => {});
		let abstractSubclass = abstractClass.abstractSubclass((that, my) => {});

		expect(abstractSubclass.isAbstract).toBeTruthy();
	});

	it("Concrete subclasses should not be abstract", () => {
		let abstractClass = object.abstractSubclass((that, my) => {});
		let concreteSubclass = abstractClass.subclass((that, my) => {});

		expect(concreteSubclass.isAbstract).toBeFalsy();
	});

	it("Abstract methods should throw exceptions", () => {
		let abstractClass = object.abstractSubclass((that, my) => {});

		abstractClass.class((that) => {
			that.foo = function () {
				that.subclassResponsibility();
			};
		});

		expect(abstractClass.foo).toThrow();
	});
});

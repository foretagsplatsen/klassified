import object from "../../src/object";

describe("abstract subclass", function() {

	it("Can create abstract subclasses", function() {
		function builder() {
			object.abstractSubclass(function(that, my) {});
		}

		expect(builder).not.toThrow();
	});

	it("Cannot instantiate abstract classes", function() {
		let abstractClass = object.abstractSubclass(function(that, my) {});

		expect(abstractClass).toThrow();
	});

	it("Abstract classes should be abstract", function() {
		let abstractClass = object.abstractSubclass(function(that, my) {});

		expect(abstractClass.isAbstract).toBeTruthy();
	});

	it("Can subclass abstract classes", function() {
		let abstractClass = object.abstractSubclass(function(that, my) {});
		let concreteSubclass = abstractClass.subclass(function(that, my) {});

		expect(concreteSubclass).not.toThrow();
	});

	it("Can create abstract subclasses of abstract classes", function() {
		let abstractClass = object.abstractSubclass(function(that, my) {});
		let abstractSubclass = abstractClass.abstractSubclass(function(that, my) {});

		expect(abstractSubclass.isAbstract).toBeTruthy();
	});

	it("Concrete subclasses should not be abstract", function() {
		let abstractClass = object.abstractSubclass(function(that, my) {});
		let concreteSubclass = abstractClass.subclass(function(that, my) {});

		expect(concreteSubclass.isAbstract).toBeFalsy();
	});

	it("Abstract methods should throw exceptions", function() {
		let abstractClass = object.abstractSubclass(function(that, my) {});
		abstractClass.class(function(that) {
			that.foo = function() {
				that.subclassResponsibility();
			};
		});

		expect(abstractClass.foo).toThrow();
	});
});

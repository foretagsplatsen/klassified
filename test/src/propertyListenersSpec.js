import object from "../../src/object";
import "../../src/property";

describe("property listeners", function() {
	it("can listen to property changes", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.property("name", spec.name);
			};

			my.get("name");
			my.set("name");
		});

		let a = animal({ name: "milou" });
		let spy = jasmine.createSpy("change");

		a.onPropertyChange("name", spy);

		a.setName("rantamplan");

		expect(spy).toHaveBeenCalledWith(a, "name", "rantamplan");
	});

	it("can listen to property accesses", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.property("name", spec.name);
			};

			my.get("name");
		});

		let a = animal({ name: "milou" });

		let spy = jasmine.createSpy("access");
		a.onPropertyAccess("name", spy);
		a.getName();

		expect(spy).toHaveBeenCalledWith(a, "name");
	});
});

define([
	"src/object",
	"src/property"
], function(object) {
	describe("property listeners", function() {
		it("can listen to property changes", function() {
			var animal = object.subclass(function(that, my) {
				my.initialize = function(spec) {
					my.property("name", spec.name);
				};

				my.get("name");
				my.set("name");
			});

			var a = animal({name: "milou"});
			var spy = jasmine.createSpy("change");

			a.onPropertyChange("name", spy);

			a.setName("rantamplan");

			expect(spy).toHaveBeenCalledWith(a, "name", "rantamplan");
		});

		it("can listen to property accesses", function() {
			var animal = object.subclass(function(that, my) {
				my.initialize = function(spec) {
					my.property("name", spec.name);
				};

				my.get("name");
			});

			var a = animal({name: "milou"});

			var spy = jasmine.createSpy("access");
			a.onPropertyAccess("name", spy);
			a.getName();

			expect(spy).toHaveBeenCalledWith(a, "name");
		});
	});
});

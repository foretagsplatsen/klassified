import object from "../../src/object";
import "../../src/property";

describe("getter/setter", function() {
	it("can generate getters", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.name = spec.name;
			};

			my.get("name");
		});

		let a = animal({ name: "milou" });

		expect(a.getName()).toBe("milou");
	});

	it("can generate custom getters", function() {
		let animal = object.subclass(function(that, my) {
			my.get("name", function() {
				return "milou";
			});
		});

		let a = animal();

		expect(a.getName()).toBe("milou");
	});

	it("can generate setters", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.name = spec.name;
			};

			that.getName = function() {
				return my.name;
			};

			my.set("name");
		});

		let a = animal({ name: "milou" });
		a.setName("Charlie");

		expect(a.getName()).toBe("Charlie");
	});

	it("can generate custom setters", function() {
		let animal = object.subclass(function(that, my) {
			that.getName = function() {
				return my.name;
			};

			my.set("name", function(value) {
				my.name = "animal named " + value;
			});
		});

		let a = animal();
		a.setName("milou");

		expect(a.getName()).toBe("animal named milou");
	});

	it("getters and setters are inherited", function() {
		let animal = object.subclass(function(that, my) {
			my.get("name");
			my.set("name");
		});

		let dog = animal.subclass(function(that, my) {});

		let d = dog();
		d.setName("milou");

		expect(d.getName()).toBe("milou");
	});
});

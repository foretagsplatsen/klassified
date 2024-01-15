import object from "../../src/object.js";
import "../../src/property.js";

describe("getter/setter", () => {
	it("can generate getters", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.name = spec.name;
			};

			my.get("name");
		});

		let a = animal({ name: "milou" });

		expect(a.getName()).toBe("milou");
	});

	it("can generate custom getters", () => {
		let animal = object.subclass((that, my) => {
			my.get("name", () => "milou");
		});

		let a = animal();

		expect(a.getName()).toBe("milou");
	});

	it("can generate setters", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.name = spec.name;
			};

			that.getName = function () {
				return my.name;
			};

			my.set("name");
		});

		let a = animal({ name: "milou" });
		a.setName("Charlie");

		expect(a.getName()).toBe("Charlie");
	});

	it("can generate custom setters", () => {
		let animal = object.subclass((that, my) => {
			that.getName = function () {
				return my.name;
			};

			my.set("name", (value) => {
				my.name = `animal named ${value}`;
			});
		});

		let a = animal();
		a.setName("milou");

		expect(a.getName()).toBe("animal named milou");
	});

	it("getters and setters are inherited", () => {
		let animal = object.subclass((that, my) => {
			my.get("name");
			my.set("name");
		});

		let dog = animal.subclass((that, my) => {});

		let d = dog();
		d.setName("milou");

		expect(d.getName()).toBe("milou");
	});
});

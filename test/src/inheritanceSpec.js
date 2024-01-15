import object from "../../src/object.js";

describe("inheritance", () => {
	it("Methods should be inherited", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.name = spec.name;
			};

			that.getName = function () {
				return my.name;
			};

			that.toString = function () {
				return that.getName();
			};
		});

		let dog = animal.subclass((that, my) => {});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("milou");
	});

	it("Methods can be overridden", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.name = spec.name;
			};

			that.getName = function () {
				return my.name;
			};

			that.toString = function () {
				return that.getName();
			};
		});

		let dog = animal.subclass((that, my) => {
			that.getName = function () {
				return "Woof";
			};
		});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("Woof");
	});

	it("Protected methods should be inherited", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.name = spec.name;
			};

			that.toString = function () {
				return my.getName();
			};

			my.getName = function () {
				return my.name;
			};
		});

		let dog = animal.subclass((that, my) => {});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("milou");
	});

	it("Protected methods can be overridden", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.name = spec.name;
			};

			that.toString = function () {
				return my.getName();
			};

			my.getName = function () {
				return my.name;
			};
		});

		let dog = animal.subclass((that, my) => {
			my.getName = function () {
				return "Woof";
			};
		});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("Woof");
	});

	it("Multiple level of inheritance works for abstract classes", () => {
		let animal = object.subclass((that) => {
			that.notPreviouslyDefinedFunction = function () {
				return true;
			};
		});

		let mammal = animal.abstractSubclass(() => {});
		let dog = mammal.abstractSubclass(() => {});
		let shepherd = dog.subclass(() => {});

		let milou = shepherd();

		expect(milou.notPreviouslyDefinedFunction()).toBeTruthy();
	});
});

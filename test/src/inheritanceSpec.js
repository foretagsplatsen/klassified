import object from "../../src/object.js";

describe("inheritance", function () {
	it("Methods should be inherited", function () {
		let animal = object.subclass(function (that, my) {
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

		let dog = animal.subclass(function (that, my) {});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("milou");
	});

	it("Methods can be overridden", function () {
		let animal = object.subclass(function (that, my) {
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

		let dog = animal.subclass(function (that, my) {
			that.getName = function () {
				return "Woof";
			};
		});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("Woof");
	});

	it("Protected methods should be inherited", function () {
		let animal = object.subclass(function (that, my) {
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

		let dog = animal.subclass(function (that, my) {});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("milou");
	});

	it("Protected methods can be overridden", function () {
		let animal = object.subclass(function (that, my) {
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

		let dog = animal.subclass(function (that, my) {
			my.getName = function () {
				return "Woof";
			};
		});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("Woof");
	});

	it("Multiple level of inheritance works for abstract classes", function () {
		let animal = object.subclass(function (that) {
			that.notPreviouslyDefinedFunction = function () {
				return true;
			};
		});

		let mammal = animal.abstractSubclass(function () {});
		let dog = mammal.abstractSubclass(function () {});
		let shepherd = dog.subclass(function () {});

		let milou = shepherd();

		expect(milou.notPreviouslyDefinedFunction()).toBeTruthy();
	});
});

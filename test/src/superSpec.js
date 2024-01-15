import object from "../../src/object.js";

describe("super", () => {
	it("super can be called within public methods", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.super();
				my.name = spec.name;
			};

			that.getName = function () {
				return my.name;
			};
		});

		let dog = animal.subclass((that, my) => {
			that.getName = function () {
				return `dog named ${that.super()}`;
			};
		});

		let milou = dog({ name: "milou" });

		expect(milou.getName()).toEqual("dog named milou");
	});

	it("super can be called within protected methods", () => {
		let animal = object.subclass((that, my) => {
			my.initialize = function (spec) {
				my.super();
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
				return `dog named ${my.super()}`;
			};
		});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("dog named milou");
	});

	it("super rebinds calls to that correctly", () => {
		let animal = object.subclass((that, my) => {
			that.toString = function () {
				return my.getName();
			};

			my.getName = function () {
				return my.name;
			};
		});

		let dog = animal.subclass((that, my) => {
			that.toString = function () {
				return `a dog named: ${that.super()}`;
			};

			my.getName = function () {
				return "milou";
			};
		});

		let milou = dog();

		expect(milou.toString()).toEqual("a dog named: milou");
	});

	it("super can be used with arguments", () => {
		let animal = object.subclass((that, my) => {
			that.foo = function (number) {
				return number;
			};
		});

		let dog = animal.subclass((that, my) => {
			that.foo = function (number) {
				return that.super(number) + 1;
			};
		});

		let milou = dog();
		let foo = milou.foo(4);

		expect(foo).toEqual(5);
	});

	it("super should be uninstalled after being used", () => {
		let animal = object.subclass((that, my) => {
			that.foo = function () {};
		});

		let dog = animal.subclass((that, my) => {
			that.foo = function (number) {
				that.super();
			};
		});

		let milou = dog();
		milou.foo();

		let keys = Object.keys(milou);

		expect(keys).not.toContain("super");
	});

	it("super calls in inherited methods should bind super for each super call", () => {
		let foo = object.subclass((that, my) => {
			that.foo = function () {
				return 1;
			};
		});

		let bar = foo.subclass((that, my) => {
			that.foo = function () {
				return that.super() + 1;
			};
		});

		let baz = bar.subclass((that, my) => {});

		expect(baz().foo()).toBe(2);
	});
});

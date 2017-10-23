import object from "../../src/object";

describe("super", function() {

	it("super can be called within public methods", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.super();
				my.name = spec.name;
			};
			that.getName = function() {
				return my.name;
			};
		});

		let dog = animal.subclass(function(that, my) {
			that.getName = function() {
				return "dog named " + that.super();
			};
		});

		let milou = dog({ name: "milou" });

		expect(milou.getName()).toEqual("dog named milou");
	});

	it("super can be called within protected methods", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.super();
				my.name = spec.name;
			};

			that.toString = function() {
				return my.getName();
			};

			my.getName = function() {
				return my.name;
			};
		});

		let dog = animal.subclass(function(that, my) {
			my.getName = function() {
				return "dog named " + my.super();
			};
		});

		let milou = dog({ name: "milou" });

		expect(milou.toString()).toEqual("dog named milou");
	});

	it("super rebinds calls to that correctly", function() {
		let animal = object.subclass(function(that, my) {

			that.toString = function() {
				return my.getName();
			};

			my.getName = function() {
				return my.name;
			};
		});

		let dog = animal.subclass(function(that, my) {
			that.toString = function() {
				return "a dog named: " + that.super();
			};

			my.getName = function() {
				return "milou";
			};
		});

		let milou = dog();

		expect(milou.toString()).toEqual("a dog named: milou");
	});

	it("super can be used with arguments", function() {
		let animal = object.subclass(function(that, my) {

			that.foo = function(number) {
				return number;
			};
		});

		let dog = animal.subclass(function(that, my) {
			that.foo = function(number) {
				return that.super(number) + 1;
			};
		});

		let milou = dog();
		let foo = milou.foo(4);

		expect(foo).toEqual(5);
	});

	it("super should be uninstalled after being used", function() {
		let animal = object.subclass(function(that, my) {

			that.foo = function() {
			};
		});

		let dog = animal.subclass(function(that, my) {
			that.foo = function(number) {
				that.super();
			};
		});

		let milou = dog();
		milou.foo();

		let keys = Object.keys(milou);

		expect(keys).not.toContain("super");
	});

	it("super calls in inherited methods should bind super for each super call", function() {
		let foo = object.subclass(function(that, my) {
			that.foo = function() {
				return 1;
			};
		});

		let bar = foo.subclass(function(that, my) {
			that.foo = function() {
				return that.super() + 1;
			};
		});

		let baz = bar.subclass(function(that, my) {
		});

		expect(baz().foo()).toBe(2);
	});
});

import object from "../../src/object.js";

describe("extension", function() {

	it("Can extend Object", function() {
		object.extend(function(that, my) {
			that.isObject = function() {
				return true;
			};
		});

		let o = object();

		expect(o.isObject()).toBe(true);
	});

	it("Extensions are inherited", function() {
		object.extend(function(that, my) {
			that.isDog = function() {
				return false;
			};
		});

		let animal = object.subclass(function() {});

		let a = animal();

		expect(!a.isDog()).toBe(true);
	});

	it("Can extend subclasses of object", function() {
		let animal = object.subclass(function(that, my) {
			that.isAnimal = function() {
				return true;
			};
		});

		animal.extend(function(that, my) {
			that.isDog = function() {
				return false;
			};
		});

		let dog = animal.subclass(function(that, my) {
			that.isDog = function() {
				return true;
			};
		});

		let a = animal();
		let d = dog();

		expect(a.isAnimal()).toBe(true);
		expect(!a.isDog()).toBe(true);
		expect(d.isAnimal()).toBe(true);
		expect(d.isDog()).toBe(true);
	});

	it("Can extend my on object", function() {
		let animal = object.subclass(function(that, my) {
			that.foo = function() {
				return my.bar();
			};
		});

		animal.extend(function(that, my) {
			that.isDog = function() {
				return false;
			};
		});

		object.extend(function(that, my) {
			my.bar = function() {
				return true;
			};
		});

		let a = animal();

		expect(a.foo()).toBe(true);
	});

	it("Can extend my on subclasses of object", function() {
		let animal = object.subclass(function(that, my) {
			that.foo = function() {
				return my.foo();
			};
		});

		animal.extend(function(that, my) {
			my.foo = function() {
				return false;
			};
		});

		let a = animal();

		expect(!a.foo()).toBe(true);
	});
});

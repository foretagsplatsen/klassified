import object from "../../src/object.js";

describe("extension", () => {
	it("Can extend Object", () => {
		object.extend((that, my) => {
			that.isObject = function () {
				return true;
			};
		});

		let o = object();

		expect(o.isObject()).toBe(true);
	});

	it("Extensions are inherited", () => {
		object.extend((that, my) => {
			that.isDog = function () {
				return false;
			};
		});

		let animal = object.subclass(() => {});

		let a = animal();

		expect(!a.isDog()).toBe(true);
	});

	it("Can extend subclasses of object", () => {
		let animal = object.subclass((that, my) => {
			that.isAnimal = function () {
				return true;
			};
		});

		animal.extend((that, my) => {
			that.isDog = function () {
				return false;
			};
		});

		let dog = animal.subclass((that, my) => {
			that.isDog = function () {
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

	it("Can extend my on object", () => {
		let animal = object.subclass((that, my) => {
			that.foo = function () {
				return my.bar();
			};
		});

		animal.extend((that, my) => {
			that.isDog = function () {
				return false;
			};
		});

		object.extend((that, my) => {
			my.bar = function () {
				return true;
			};
		});

		let a = animal();

		expect(a.foo()).toBe(true);
	});

	it("Can extend my on subclasses of object", () => {
		let animal = object.subclass((that, my) => {
			that.foo = function () {
				return my.foo();
			};
		});

		animal.extend((that, my) => {
			my.foo = function () {
				return false;
			};
		});

		let a = animal();

		expect(!a.foo()).toBe(true);
	});
});

import object from "../../src/object.js";

describe("singleton", () => {
	it("can create singleton subclass of object", () => {
		let animal = object.singletonSubclass((that, my) => {});

		expect(animal).toBeTruthy();
		expect(animal.instance()).toBeTruthy();
	});

	it("cannot create instances of singleton classes", () => {
		let animal = object.singletonSubclass((that, my) => {});

		expect(() => {
			animal();
		}).toThrowError(
			"Cannot create new instances of a singleton class, use `instance` instead.",
		);
	});

	it("can create singleton subclass of subclass of object", () => {
		let animal = object.abstractSubclass((that, my) => {});
		let dog = animal.singletonSubclass((that, my) => {});

		expect(dog).toBeTruthy();
		expect(dog.instance()).toBeTruthy();
	});

	it("singleton classes always return the same instance", () => {
		let animal = object.singletonSubclass((that, my) => {});
		let instance1 = animal.instance();
		let instance2 = animal.instance();

		expect(instance1).toBe(instance2);
	});

	it("singleton initialize is called only once", () => {
		let count = 0;
		let animal = object.singletonSubclass((that, my) => {
			my.initialize = function (spec) {
				my.super(spec);
				count++;
			};
		});

		animal.instance();
		animal.instance();
		animal.instance();
		animal.instance();

		expect(count).toBe(1);
	});

	it("can inherit from a singleton class", () => {
		let animal = object.singletonSubclass((that, my) => {
			my.initialize = function (spec) {
				my.super(spec);
				my.name = spec.name;
			};

			my.get("name");
		});
		let dog = animal.subclass(() => {});
		let instance1 = dog({
			name: "Milou",
		});
		let instance2 = dog({
			name: "Rantanplan",
		});

		expect(instance1).not.toBe(instance2);
		expect(instance1.getName()).toBe("Milou");
		expect(instance2.getName()).toBe("Rantanplan");
	});
});

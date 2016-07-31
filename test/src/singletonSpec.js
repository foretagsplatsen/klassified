define(["src/object"], function(object) {
	describe("singleton", function() {
		it("can create singleton subclass of object", function() {
			var animal = object.singletonSubclass(function(that, my) { });
			expect(animal).toBeTruthy();
			expect(animal.instance()).toBeTruthy();
		});

		it("cannot create instances of singleton classes", function() {
			var animal = object.singletonSubclass(function(that, my) { });
			expect(function() {
				animal.new();
			}).toThrowError("Cannot create new instances of a singleton class, use `instance` instead.");
		});

		it("can create singleton subclass of subclass of object", function() {
			var animal = object.abstractSubclass(function(that, my) { });
			var dog = animal.singletonSubclass(function(that, my) { });

			expect(dog).toBeTruthy();
			expect(dog.instance()).toBeTruthy();
		});

		it("singleton classes always return the same instance", function() {
			var animal = object.singletonSubclass(function(that, my) { });
			var instance1 = animal.instance();
			var instance2 = animal.instance();

			expect(instance1).toBe(instance2);
		});

		it("singleton initialize is called only once", function() {
			var count = 0;
			var animal = object.singletonSubclass(function(that, my) {
				my.initialize = function(spec) {
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

		it("can inherit from a singleton class", function() {
			var animal = object.singletonSubclass(function(that, my) {
				my.initialize = function(spec) {
					my.super(spec);
					my.name = spec.name;
				};

				my.get("name");
			});
			var dog = animal.subclass(function() {});
			var instance1 = dog.new({
				name: "Milou"
			});
			var instance2 = dog.new({
				name: "Rantanplan"
			});

			expect(instance1).not.toBe(instance2);
			expect(instance1.getName()).toBe("Milou");
			expect(instance2.getName()).toBe("Rantanplan");
		});
	});
});

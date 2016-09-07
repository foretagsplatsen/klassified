define([
	"src/object",
	"src/property"
], function(object) {
	describe("getter/setter", function() {
		it("can generate getters", function() {
			var animal = object.subclass(function(that, my) {
				my.initialize = function(spec) {
					my.name = spec.name;
				};

				my.get("name");
			});

			var a = animal({name: "milou"});
			expect(a.getName()).toBe("milou");
		});

		it("can generate custom getters", function() {
			var animal = object.subclass(function(that, my) {
				my.get("name", function() {
					return "milou";
				});
			});

			var a = animal();
			expect(a.getName()).toBe("milou");
		});

		it("can generate setters", function() {
			var animal = object.subclass(function(that, my) {
				my.initialize = function(spec) {
					my.name = spec.name;
				};

				that.getName = function() {
					return my.name;
				};

				my.set("name");
			});

			var a = animal({name: "milou"});
			a.setName("Charlie");
			expect(a.getName()).toBe("Charlie");
		});

		it("can generate custom setters", function() {
			var animal = object.subclass(function(that, my) {
				that.getName = function() {
					return my.name;
				};

				my.set("name", function(value) {
					my.name = "animal named " + value;
				});
			});

			var a = animal();
			a.setName("milou");
			expect(a.getName()).toBe("animal named milou");
		});

		it("getters and setters are inherited", function() {
			var animal = object.subclass(function(that, my) {
				my.get("name");
				my.set("name");
			});

			var dog = animal.subclass(function(that, my) {});

			var d = dog();
			d.setName("milou");
			expect(d.getName()).toBe("milou");
		});
	});
});

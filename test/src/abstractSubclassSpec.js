define(["src/object"], function(object) {
	describe("abstract subclass", function() {

		it("Can create abstract subclasses", function() {
			var builder = function() {
				object.abstractSubclass(function(that, my) {});
			};

			expect(builder).not.toThrow();
		});

		it("Cannot instantiate abstract classes", function() {
			var abstractClass = object.abstractSubclass(function(that, my) {});

			expect(abstractClass).toThrow();
		});

		it("Abstract classes should be abstract", function() {
			var abstractClass = object.abstractSubclass(function(that, my) {});
			expect(abstractClass.isAbstract).toBeTruthy();
		});

		it("Can subclass abstract classes", function() {
			var abstractClass = object.abstractSubclass(function(that, my) {});
			var concreteSubclass = abstractClass.subclass(function(that, my) {});

			expect(concreteSubclass).not.toThrow();
		});

		it("Can create abstract subclasses of abstract classes", function() {
			var abstractClass = object.abstractSubclass(function(that, my) {});
			var abstractSubclass = abstractClass.abstractSubclass(function(that, my) {});

			expect(abstractSubclass.isAbstract).toBeTruthy();
		});

		it("Concrete subclasses should not be abstract", function() {
			var abstractClass = object.abstractSubclass(function(that, my) {});
			var concreteSubclass = abstractClass.subclass(function(that, my) {});

			expect(concreteSubclass.isAbstract).toBeFalsy();
		});

		it("Abstract methods should throw exceptions", function() {
			var abstractClass = object.abstractSubclass(function(that, my) {});
			abstractClass.class(function(that) {
				that.foo = function() {
					that.subclassResponsibility();
				};
			});

			expect(abstractClass.foo).toThrow();
		});
	});
});

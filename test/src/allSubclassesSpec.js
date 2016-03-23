define([
	"src/object"
], function(object) {
	describe("allSubclasses", function() {
		it("Can get all subclasses of a class", function() {
			var animal = object.subclass(function() {});
			var dog = animal.subclass(function() {});
			var shepherd = dog.subclass(function() {});
			var cat = animal.subclass(function() {});

			expect(animal.allSubclasses()).toEqual([dog, cat, shepherd]);
		});
	});
});

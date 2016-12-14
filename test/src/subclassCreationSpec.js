define(["src/object"], function(object) {

	describe("subclass creation", function() {

		it("Can create a subclass", function() {
			var animal = object.subclass(function() {
			});

			expect(object.subclasses).toContain(animal);
		});

		it("Can create a subclass of a subclass", function() {
			var animal = object.subclass(function() {
			});
			var dog = animal.subclass(function() {
			});

			expect(animal.subclasses).toEqual([dog]);
		});
	});
});

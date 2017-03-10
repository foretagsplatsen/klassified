define([
	"src/object"
], function(object) {
	describe("allConcreteSubclasses", function() {
		it("Can get all concrete subclasses of a class", function() {
			var a = object.abstractSubclass(function() {});
			var b = a.abstractSubclass(function() {});
			var c = a.subclass(function() {});
			var d = b.subclass(function() {});
			var e = d.abstractSubclass(function() {});
			var f = e.subclass(function() {});
			expect(a.allConcreteSubclasses()).toEqual([c, d, f]);
		});
	});
});

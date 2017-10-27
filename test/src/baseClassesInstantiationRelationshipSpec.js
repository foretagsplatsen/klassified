define([
	"src/klassified"
], function(klassified) {
	describe("Base class relationships", () => {
		it("base class instance relationships should be correct", () => {
			expect(klassified.object.klass.klass).toBe(klassified.metaclass);
			expect(klassified.behavior.klass.klass).toBe(klassified.metaclass);
			expect(klassified.behavior.klass.klass).toBe(klassified.metaclass);
			expect(klassified.klass.klass.klass).toBe(klassified.metaclass);
			expect(klassified.metaclass.klass.klass).toBe(klassified.metaclass);

			expect(klassified.klass.klass.klass.klass).toBe(klassified.metaclass.klass);
		});

		it("base class superclass relationships", () => {
			expect(klassified.object.superclass).toBe(null);
			expect(klassified.behavior.superclass).toBe(klassified.object);
			expect(klassified.klass.superclass).toBe(klassified.behavior);
			expect(klassified.metaclass.superclass).toBe(klassified.behavior);

			expect(klassified.object.klass.superclass).toBe(klassified.klass);
			expect(klassified.behavior.klass.superclass).toBe(klassified.object.klass);
			expect(klassified.klass.klass.superclass).toBe(klassified.behavior.klass);
			expect(klassified.metaclass.klass.superclass).toBe(klassified.behavior.klass);
		});
	});
});

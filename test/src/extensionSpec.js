define(["src/object"], function(object) {

	describe("extension", function() {

		it("Can extend Object", function() {
			object.extend(function(that, my) {
				that.isObject = function() {
					return true;
				};
			});

			var o = object.new();

			expect(o.isObject()).toBe(true);
		});

		it("Extensions are inherited", function() {
			object.extend(function(that, my) {
				that.isDog = function() {
					return false;
				};
			});

			var animal = object.subclass(function() {});

			var a = animal.new();

			expect(!a.isDog()).toBe(true);
		});

		it("Can extend subclasses of object", function() {
			var animal = object.subclass(function(that, my) {
				that.isAnimal = function() {
					return true;
				};
			});

			animal.extend(function(that, my) {
				that.isDog = function() {
					return false;
				};
			});

			var dog = animal.subclass(function(that, my) {
				that.isDog = function() {
					return true;
				};
			});

			var a = animal.new();
			var d = dog.new();

			expect(a.isAnimal()).toBe(true);
			expect(!a.isDog()).toBe(true);
			expect(d.isAnimal()).toBe(true);
			expect(d.isDog()).toBe(true);
		});

		it("Can extend my on object", function() {
			var animal = object.subclass(function(that, my) {
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

			var a = animal.new();
			expect(a.foo()).toBe(true);
		});

		it("Can extend my on subclasses of object", function() {
			var animal = object.subclass(function(that, my) {
				that.foo = function() {
					return my.foo();
				};
			});

			animal.extend(function(that, my) {
				my.foo = function() {
					return false;
				};
			});

			var a = animal.new();
			expect(!a.foo()).toBe(true);
		});
	});
});

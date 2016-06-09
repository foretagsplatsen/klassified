define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("class-inheritance");

    test('Cannot add class-side methods to Object', function() {
		var exception;
		try {
			object.class(function(that) {
				that.foo = function() {
					return true;
				};
			});
		} catch(e) {
			exception = true;
		}

        assert.ok(exception);
    });

	test('Class-side methods are inherited in direct subclasses', function(){
		var animal = object.subclass(function() {});
		animal.class(function(that) {
			that.bar = function() {
				return true;
			};
		});

		var dog = animal.subclass(function() {});

		assert.ok(dog.bar());
	});

	test('Class-side methods are inherited in direct subclasses', function(){
		var animal = object.subclass(function() {});
		animal.class(function(that) {
			that.bar = function() {
				return true;
			};
		});

		var dog = animal.subclass(function() {});

		assert.ok(dog.bar());
	});

	test('Class-side methods are not propagated to the superclass', function(){
		var animal = object.subclass(function() {});
		animal.class(function(that) {
			that.bar = function() {
				return true;
			};
		});

		var dog = animal.subclass(function() {});
		dog.class(function(that) {
			that.baz = function() {
				return true;
			};
		});

		assert.equal(object.bar, undefined);
		assert.equal(animal.baz, undefined);
	});

	test('Class-side method reference the correct class when inherited', function(){
		var animal = object.subclass(function() {});
		animal.class(function(that) {
			that.foo = function() {
				return that.bar();
			};

			that.bar = function() {
				return false;
			};
		});

		var dog = animal.subclass(function() {});
		dog.class(function(that) {
			that.bar = function() {
				return true;
			};
		});

		assert.ok(dog.foo());
	});

	test('Custom constructors instantiate objects of the correct class', function(){
		var animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.name = spec.name;
			};

			that.getName = function() {
				return my.name;
			};
		});

		animal.class(function(that) {
			that.named = function(name) {
				return that({
					name: name
				});
			};
		});

		var dog = animal.subclass(function() {});

		assert.equal(dog.named('milou').getClass(), dog);
		assert.equal(animal.named('babar').getClass(), animal);
	});
});

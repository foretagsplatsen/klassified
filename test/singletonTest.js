define(function(require) {

	var assert = require('chai').assert;
	var object = require('../src/object');

	suite("singleton");

	test('can create singleton subclass of object', function() {
		var animal = object.singletonSubclass(function(that, my) { });
		assert.ok(animal);
		assert.ok(animal.instance());
	});

	test('cannot create instances of singleton classes', function() {
		var animal = object.singletonSubclass(function(that, my) { });
		assert.throws(function() {
			animal();
		}, 'Cannot create new instances of a singleton class, use `instance` instead.');
	});

	test('can create singleton subclass of subclass of object', function() {
		var animal = object.abstractSubclass(function(that, my) { });
		var dog = animal.singletonSubclass(function(that, my) { });
		assert.ok(dog);
		assert.ok(dog.instance());
	});

	test('singleton classes always return the same instance', function() {
		var animal = object.singletonSubclass(function(that, my) { });
		var instance1 = animal.instance();
		var instance2 = animal.instance();
		assert.equal(instance1, instance2);
		assert.ok(instance1 === instance2);
	});

	test('singleton initialize is called only once', function() {
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

		assert.equal(count, 1);
	});

	test('can inherit from a singleton class', function() {
		var animal = object.singletonSubclass(function(that, my) {
			my.initialize = function(spec) {
				my.super(spec);
				my.name = spec.name;
			};

			my.get('name');
		});
		var dog = animal.subclass(function() {});
		var instance1 = dog({
			name: 'Milou'
		});
		var instance2 = dog({
			name: 'Rantanplan'
		});
		assert.notEqual(instance1, instance2);
		assert.equal(instance1.getName(), 'Milou');
		assert.equal(instance2.getName(), 'Rantanplan');
	});
});

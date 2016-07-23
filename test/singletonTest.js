define(function(require) {

	var assert = require('chai').assert;
	var object = require('../src/object');

	suite("singleton");

	test('can create singleton subclass of object', function() {
		var animal = object.singleton(function(that, my) { });
		assert.ok(animal);
		assert.ok(animal());
	});

	test('can create singleton subclass of subclass of object', function() {
		var animal = object.abstractSubclass(function(that, my) { });
		var dog = animal.singleton(function(that, my) { });
		assert.ok(dog);
		assert.ok(dog());
	});

	test('singleton classes always return the same instance', function() {
		var animal = object.singleton(function(that, my) { });
		var instance1 = animal();
		var instance2 = animal();
		assert.equal(instance1, instance2);
		assert.ok(instance1 === instance2);
	});

	test('singleton is initialized at first call', function() {
		var animal = object.singleton(function(that, my) {
			my.initialize = function(spec) {
				my.super(spec);
				my.name = spec.name;
			};

			my.get('name');
		});

		// Initialize the singleton
		animal({
			name: 'Milou'
		});

		var instance2 = animal({
			name: 'Rantanplan'
		});
		assert.equal(instance2.getName(), 'Milou');
	});

	test('singleton can be initialized at creation', function() {
		var animal = object.singleton(function(that, my) {
			my.initialize = function(spec) {
				my.super(spec);
				my.name = spec.name;
			};

			my.get('name');
		}, {
			spec: {
				name: 'Santa\'s Little Helper'
			}
		});

		// Initialize the singleton
		var instance1 = animal({
			name: 'Milou'
		});

		var instance2 = animal({
			name: 'Rantanplan'
		});

		assert.equal(instance2.getName(), 'Santa\'s Little Helper');
		assert.equal(instance2.getName(), 'Santa\'s Little Helper');
	});

	test('singleton initialize is called only once', function() {
		var count = 0;
		var animal = object.singleton(function(that, my) {
			my.initialize = function(spec) {
				my.super(spec);
				count++;
			};
		}, {
			initializeAtCreation: true
		});

		animal();
		animal();
		animal();
		animal();

		assert.equal(count, 1);
	});

	test('can inherit from a singleton class', function() {
		var animal = object.singleton(function(that, my) {
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

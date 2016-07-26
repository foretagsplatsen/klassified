define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("subclass creation");

    test('Can create a subclass', function() {
		var animal = object.subclass(function() {});

		assert.include(object.subclasses, animal);
    });

	test('Can create a subclass of a subclass', function() {
		var animal = object.subclass(function() {});
		var dog = animal.subclass(function() {});

		assert.deepEqual(animal.subclasses, [dog]);
    });
});

define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("allSubclasses");

    test('Can get all subclasses of a class', function() {
	    var animal = object.subclass(function() {});
	    var dog = animal.subclass(function() {});
		var shepard = dog.subclass(function() {});
	    var cat = animal.subclass(function() {});

		assert.deepEqual(animal.allSubclasses(), [dog, cat, shepard]);
    });
});

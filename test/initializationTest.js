define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("initialization");

    test('initialize should be called upon object creation', function() {
		var initialized = false;

		var animal = object.subclass(function(that, spec, my) {
			my.initialize = function() {
				initialized = true;
			};
		});

		assert.ok(!initialized);
		animal();
		assert.ok(initialized);
    });
});

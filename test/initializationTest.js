define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("initialization");

    test('initialize should be called upon object creation', function() {
		var initialized = false;

		var animal = object.subclass(function(that, my) {
			my.initialize = function() {
				initialized = true;
			};
		});

		assert.ok(!initialized);
		animal();
		assert.ok(initialized);
    });

	test('initialize should be called only once', function() {
		var initializeCalls = 0;

		var animal = object.subclass(function(that, my) {
			my.initialize = function() {
				initializeCalls += 1;
			};
		});

		var dog = animal.subclass(function(that, my) {
			my.initialize = function() {
				initializeCalls += 1;
			};
		});

		dog();
		assert.equal(initializeCalls, 1);
    });

	test('can use overrides within initialize', function() {
		var animal = object.subclass(function(that, my) {
			my.initialize = function() {
				that.foo();
			};

			that.foo = function() {
				that.bar = 'animal';
			};
		});

		var dog = animal.subclass(function(that, my) {
			that.foo = function() {
				that.bar = 'dog';
			};
		});

		var d = dog();
		var a = animal();
		assert.equal(a.bar, 'animal');
		assert.equal(d.bar, 'dog');
    });

	test('can call super from initialize', function() {
		var animal = object.subclass(function(that, my) {
			my.initialize = function() {
				my.super();
				that.foo = 1;
			};
		});

		var dog = animal.subclass(function(that, my) {
			my.initialize = function() {
				my.super();
				that.bar = 2;
			};
		});

		var d = dog();
		assert.equal(d.foo, 1);
		assert.equal(d.bar, 2);
    });
});

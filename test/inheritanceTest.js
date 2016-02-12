define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("inheritance");

    test('Methods should be inherited', function() {
		var animal = object.subclass(function(that, spec, my) {
			that.initialize = function() {
				my.name = spec.name;
			};
			that.getName = function() {
				return my.name;
			};
			that.toString = function() {
				return that.getName();
			};
		});

		var dog = animal.subclass(function(that, spec, my) {});

		var milou = dog({name: 'milou'});

		assert.equal(milou.toString(), 'milou');
    });

	test('Methods can be overridden', function() {
		var animal = object.subclass(function(that, spec, my) {
			that.initialize = function() {
				my.name = spec.name;
			};
			that.getName = function() {
				return my.name;
			};
			that.toString = function() {
				return that.getName();
			};
		});

		var dog = animal.subclass(function(that, spec, my) {
			that.getName = function() {
				return 'Woof';
			};
		});

		var milou = dog({name: 'milou'});

		assert.equal(milou.toString(), 'Woof');
    });

	test('Protected methods should be inherited', function() {
		var animal = object.subclass(function(that, spec, my) {
			that.initialize = function() {
				my.name = spec.name;
			};
			that.toString = function() {
				return my.getName();
			};
			my.getName = function() {
				return my.name;
			};
		});

		var dog = animal.subclass(function(that, spec, my) {});

		var milou = dog({name: 'milou'});

		assert.equal(milou.toString(), 'milou');
    });

	test('Protected methods can be overridden', function() {
		var animal = object.subclass(function(that, spec, my) {
			that.initialize = function() {
				my.name = spec.name;
			};
			that.toString = function() {
				return my.getName();
			};
			my.getName = function() {
				return my.name;
			};
		});

		var dog = animal.subclass(function(that, spec, my) {
			my.getName = function() {
				return 'Woof';
			};
		});

		var milou = dog({name: 'milou'});

		assert.equal(milou.toString(), 'Woof');
    });
});

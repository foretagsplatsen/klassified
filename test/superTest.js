define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("super");

    test('super can be called within public methods', function() {
		var animal = object.subclass(function(that, spec, my) {
			that.initialize = function() {
				my.name = spec.name;
			};
			that.getName = function() {
				return my.name;
			};
		});

		var dog = animal.subclass(function(that, spec, my) {
			that.getName = function() {
				return 'dog named ' + that.super.getName();
			};
		});

		var milou = dog({name: 'milou'});

		assert.equal(milou.getName(), 'dog named milou');
    });

	test('super can be called within protected methods', function() {
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
				return 'dog named ' + my.super.getName();
			};
		});

		var milou = dog({name: 'milou'});

		assert.equal(milou.toString(), 'dog named milou');
    });
});

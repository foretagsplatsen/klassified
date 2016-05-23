define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("getter/setter");

    test('can generate getters', function() {
		var animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.name = spec.name;
			};

			my.get('name');
		});

		var a = animal({name: 'milou'});
		assert.equal(a.getName(), 'milou');
    });

	test('can generate custom getters', function() {
		var animal = object.subclass(function(that, my) {
			my.get('name', function() {
				return 'milou';
			});
		});

		var a = animal();
		assert.equal(a.getName(), 'milou');
	});

	test('can generate setters', function() {
		var animal = object.subclass(function(that, my) {
			my.initialize = function(spec) {
				my.name = spec.name;
			};

			that.getName = function() {
				return my.name;
			};

			my.set('name');
		});

		var a = animal({name: 'milou'});
		a.setName('Charlie');
		assert.equal(a.getName(), 'Charlie');
    });

	test('can generate custom setters', function() {
		var animal = object.subclass(function(that, my) {
			that.getName = function() {
				return my.name;
			};

			my.set('name', function(value) {
				my.name = 'animal named ' + value;
			});
		});

		var a = animal();
		a.setName('milou');
		assert.equal(a.getName(), 'animal named milou');
	});

	test('getters and setters are inherited', function() {
		var animal = object.subclass(function(that, my) {
			my.get('name');
			my.set('name');
		});

		var dog = animal.subclass(function(that, my) {});

		var d = dog();
		d.setName('milou');
		assert.equal(d.getName(), 'milou');
	});
});

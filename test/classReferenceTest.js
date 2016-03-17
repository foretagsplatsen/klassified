define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("class-reference");

    test('Instance of object can access their class', function() {
        var o = object();

        assert.equal(o.getClass(), object);
    });

    test('Instances of subclasses of object reference the correct class', function() {
        var animal = object.subclass(function(that, my) {});

        var a = animal();

        assert.equal(a.getClass(), animal);
    });

	test('Instances of subclasses of subclasses refer to the correct class', function(){
		var animal = object.subclass(function(that, my) {});
        var dog = animal.subclass(function(that, my) {});

        var d = dog();

        assert.equal(d.getClass(), dog);
	});

	test('Can refer to class-side methods from an instance', function() {
		var animal = object.subclass(function(that, my) {
			that.foo = function() {
				return that.getClass().foo();
			};
		});

		animal.class(function(that) {
			that.foo = function() {
				return true;
			};
		});

        var a = animal();

        assert.ok(a.foo());
	});
});

define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("extension");

    test('Can extend Object', function() {
        object.extend(function(that, my) {
            that.isObject = function() {
                return true;
            };
        });

        var o = object();

        assert.ok(o.isObject());
    });

    test('Extensions are inherited', function() {
        object.extend(function(that, my) {
            that.isDog = function() {
                return false;
            };
        });

        var animal = object.subclass(function() {});

        var a = animal();

        assert.ok(!a.isDog());
    });

    test('Can extend subclasses of object', function() {
        var animal = object.subclass(function(that, my) {
            that.isAnimal = function() {
                return true;
            };
        });

        animal.extend(function(that, my) {
            that.isDog = function() {
                return false;
            };
        });

        var dog = animal.subclass(function(that, my) {
            that.isDog = function() {
                return true;
            };
        });

        var a = animal();
        var d = dog();

        assert.ok(a.isAnimal());
        assert.ok(!a.isDog());
        assert.ok(d.isAnimal());
        assert.ok(d.isDog());
    });

	test('Can extend my on object', function() {
        var animal = object.subclass(function(that, my) {
            that.foo = function() {
                return my.bar();
            };
        });

        animal.extend(function(that, my) {
            that.isDog = function() {
                return false;
            };
        });

		object.extend(function(that, my) {
			my.bar = function() {
				return true;
			};
		});

        var a = animal();
        assert.ok(a.foo());
    });

	test('Can extend my on subclasses of object', function() {
        var animal = object.subclass(function(that, my) {
			that.foo = function() {
                return my.foo();
            };
		});

		animal.extend(function(that, my) {
			my.foo = function() {
				return false;
			};
		});

        var a = animal();
        assert.ok(!a.foo());
	});
});

define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("extension");

    test('Can extend Object', function() {
        object.extend(function(that, spec, my) {
            that.isObject = function() {
                return true;
            };
        });

        var o = object();

        assert.ok(o.isObject());
    });

    test('Extensions are inherited', function() {
        object.extend(function(that, spec, my) {
            that.isDog = function() {
                return false;
            };
        });

        var animal = object.subclass(function() {});

        var a = animal();

        assert.ok(!a.isDog());
    });

    test('Can extend subclasses of object', function() {
        var animal = object.subclass(function(that, spec, my) {
            that.isAnimal = function() {
                return true;
            };
        });

        var dog = animal.subclass(function(that, spec, my) {
            that.isDog = function() {
                return true;
            };
        });

        animal.extend(function(that, spec, my) {
            that.isDog = function() {
                return false;
            };
        });

        var a = animal();
        var d = dog();

        assert.ok(a.isAnimal());
        assert.ok(!a.isDog());
        assert.ok(d.isAnimal());
        assert.ok(d.isDog());
    });
});

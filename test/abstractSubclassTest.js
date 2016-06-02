define(function(require) {

    var assert = require('chai').assert;
    var object = require('../src/object');

    suite("abstract subclass");

    test('Can create abstract subclasses', function() {
        var abstractClass = object.abstractSubclass(function(that, my) {});
    });

    test('Cannot instantiate abstract classes', function() {
        var abstractClass = object.abstractSubclass(function(that, my) {});

        assert.throws(abstractClass);
    });

    test('Abstract classes should be abstract', function() {
        var abstractClass = object.abstractSubclass(function(that, my) {});
		assert(abstractClass.isAbstract);
    });

	test('Can subclass abstract classes', function() {
        var abstractClass = object.abstractSubclass(function(that, my) {});
		var concreteSubclass = abstractClass.subclass(function(that, my) {});
		assert.doesNotThrow(concreteSubclass);
	});

	test('Can create abstract subclasses of abstract classes', function() {
        var abstractClass = object.abstractSubclass(function(that, my) {});
		var abstractSubclass = abstractClass.abstractSubclass(function(that, my) {});
		assert(abstractSubclass.isAbstract);
	});

	test('Concrete subclasses should not be abstract', function() {
        var abstractClass = object.abstractSubclass(function(that, my) {});
		var concreteSubclass = abstractClass.subclass(function(that, my) {});
		assert.isNotOk(concreteSubclass.isAbstract);
    });

	test('Abstract methods should throw exceptions', function() {
        var abstractClass = object.abstractSubclass(function(that, my) {});
		abstractClass.class(function(that) {
			that.foo = function() {
				that.subclassResponsibility();
			};
		});
		assert.throws(abstractClass.foo);
    });
});

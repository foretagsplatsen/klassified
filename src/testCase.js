define([
	'./object'
], function(object) {

	/**
	 * `testCase` implements an abstract test class, using Jasmine behind the
	 * scenes.
	 *
	 * All subclasses of testCase are singletons (so that one instance is
	 * created when the class is loaded).
	 */
	var testCase = object.abstractSubclass(function(that, my) {

		my.force = function() {
			return false;
		};

		my.name = function() {
			return my.subclassResponsibility;
		};

		my.describe = function(name, callback) {
			if (my.force()) {
				fdescribe(name, function() {
					callback();
				});
			} else {
				describe(name, function() {
					callback();
				});
			}
		};

		my.it = function(name, callback) {
			it(name, callback);
		};

		my.expect = function(object) {
			return expect(object);
		};

		my.initialize = function(spec) {
			my.super(spec);
			var tests = my.registeredTests();
			my.describe(my.name(), function() {
				tests.forEach(function(test) {
					test();
				});
			});
		};

		my.registeredTests = function() {
			var result = [];
			var testRegex = /\bmy.it\b/;

			Object.keys(my).forEach(function(name) {
				if (typeof my[name] === 'function' &&
					testRegex.test(my[name])) {
					result.push(my[name]);
				}
			});

			return result;
		};
	});

	testCase.class(function(that) {
		that.isTestCase = function() {
			return true;
		};

		// All test classes are singletons.
		// TODO: Refactor with a super call when we'll have super on class-side.
		that.subclass = (function(superSubclass) {
			return function(builder) {
				var klass = superSubclass.apply(that, [builder]);
				var instance = klass();
				klass.isSingleton = true;
				klass.instance = function() {
					return instance;
				};

				return klass;
			};
		})(that.subclass);
	});

	return testCase;
});

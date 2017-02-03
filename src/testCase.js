define([
	"./object"
], function(object) {

	/**
	 * `testCase` implements an abstract test class, using Jasmine behind the
	 * scenes.
	 *
	 * All subclasses of testCase are singletons (so that one instance is
	 * created when the class is loaded).
	 */
	var testCase = object.abstractSubclass(function(that, my) {

		my.initialize = function(spec) {
			my.super(spec);
			var tests = my.registeredTests();
			suite(my.name(), function() {
				beforeEach(my.beforeEach); // eslint-disable-line jasmine/no-global-setup
				afterEach(my.afterEach); // eslint-disable-line jasmine/no-global-setup
				beforeAll(my.beforeAll); // eslint-disable-line jasmine/no-global-setup
				afterAll(my.afterAll); // eslint-disable-line jasmine/no-global-setup
				tests.forEach(function(test) {
					it(test.name, test.fn);
				});
			});
		};

		my.force = function() {
			return false;
		};

		my.beforeEach = function() {};
		my.beforeAll = function() {};
		my.afterEach = function() {};
		my.afterAll = function() {};

		my.name = function() {
			return my.subclassResponsibility();
		};

		my.expect = expect;
		my.spyOn = spyOn;

		my.registeredTests = function() {
			var result = [];
			var testRegex = /Test$/;

			Object.keys(my).forEach(function(name) {
				if (typeof my[name] === "function" &&
					testRegex.test(name)) {
					result.push({
						name: my.buildTestName(name),
						fn: my[name]
					});
				}
			});

			return result;
		};

		my.buildTestName = function(name) {
			name = name.slice(0, -4);
			var regexp = /([A-Z][^A-Z]*)/g;
			name = name.replace(regexp, " $1");
			name = name.toLowerCase();
			return name;
		};

		function suite(name, callback) {
			if (my.force()) {
				fdescribe(name, function() { // eslint-disable-line jasmine/no-focused-tests
					callback();
				});
			} else {
				describe(name, function() {
					callback();
				});
			}
		}
	});

	testCase.class(function(that) {
		that.isTestCase = function() {
			return true;
		};

		// All test classes are singletons.
		// TODO: Refactor with a super call when we"ll have super on class-side.
		that.subclass = (function(superSubclass, options) {
			return function(builder) {
				var klass = superSubclass.apply(that, [builder]);

				if (options && options.isAbstract) {
					return klass;
				}

				var instance = klass();
				klass.isSingleton = true;
				klass.instance = function() {
					return instance;
				};

				return klass;
			};
		})(that.subclass);

		// We need this to ensure we don't have abstract & singleton classes
		that.abstractSubclass = (function(superAbstractSubclass) {
			return function(builder) {
				var klass = this.subclass(builder, {isAbstract: true});
				klass.isAbstract = true;
				return klass;
			};

		})(that.abstractSubclass);
	});

	return testCase;
});

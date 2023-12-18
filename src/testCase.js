/* eslint jasmine/no-global-setup: 0 */
import object from "./object.js";

/**
 * `testCase` implements an abstract test class, using Jasmine behind the
 * scenes.
 *
 * All subclasses of testCase are singletons (so that one instance is
 * created when the class is loaded).
 */
const testCase = object.abstractSubclass(function(that, my) {

	my.initialize = function(spec) {
		my.super(spec);
		let tests = my.registeredTests();
		suite(my.name(), function() {
			beforeEach(my.beforeEach);
			afterEach(my.afterEach);
			beforeAll(my.beforeAll);
			afterAll(my.afterAll);
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
		let result = [];
		let testRegex = /Test$/;

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
		let regexp = /([A-Z][^A-Z]*)/g;
		name = name.replace(regexp, " $1");
		name = name.toLowerCase();
		return name;
	};

	function suite(name, callback) {
		if (my.force()) {
			// eslint-disable-next-line jasmine/no-focused-tests -- false positive, this code is good!
			fdescribe(name, function() {
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
	that.subclass = (function(superSubclass) {
		return function(builder, options) {
			let klass = superSubclass.apply(that, [builder]);

			if (options && options.isAbstract) {
				return klass;
			}

			let instance = klass();
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
			let klass = this.subclass(builder, { isAbstract: true });
			klass.isAbstract = true;
			return klass;
		};

	})(that.abstractSubclass);
});

export default testCase;

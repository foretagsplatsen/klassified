define(function(require) {

    var assert = require('chai').assert;
    var testCase = require('../src/testCase');

    suite("testCase");

	/**
	 * Mocking Jasmine's basic API using Chai's assert API.
	 * describe, it and expect are globals.
	 */

	var beforeEachCallback = function() {};
	var beforeAllCallback = function() {};
	var afterEachCallback = function() {};
	var afterAllCallback = function() {};

	describe = function(name, callback) {
		suite(name);
		beforeAllCallback();
		callback();
		afterAllCallback();
	};

	it = function(name, callback) {
		beforeEachCallback();
		test(name, callback);
		afterEachCallback();
	};

	expect = function(expected) {
		return {
			toBe: function(actual) {
				assert.equal(expected, actual);
			}
		};
	};

	beforeEach = function(callback) {
		beforeEachCallback = callback;
	};

	afterEach = function(callback) {
		afterEachCallback = callback;
	};

	beforeAll = function(callback) {
		beforeAllCallback = callback;
	};

	afterAll = function(callback) {
		afterAllCallback = callback;
	};


	var bTestCaseCount;

	var a = testCase.subclass(function(that, my) {
		my.name = function() {
			return 'TestCase - A';
		};

		my.beforeEach = function() {
			that.isA = true;
		};

		my.isFoo = function() {
			my.it('isFoo', function() {
				my.expect(my.foo).toBe(false);
			});
		};

		my.isBar = function() {
			my.it('isBar', function() {
				my.expect(my.bar).toBe(true);
			});
		};

		my.initialize = function(spec) {
			my.super(spec);

			my.foo = false;
			my.bar = true;
		};
	});

	var b = a.subclass(function(that, my) {
		my.initialize = function(spec) {
			bTestCaseCount = 0;
			my.super(spec);
			my.foo = true;
		};

		my.beforeEach = function() {
			my.super();
			that.isB = true;
		};

		// Keep track of the number of tests run.
		my.describe = function(name, callback) {
			my.super(name, callback);
		};

		my.it = function(name, callback) {
			bTestCaseCount++;
			my.super(name, callback);
		};

		my.name = function() {
			return 'TestCase - B';
		};

		my.isFoo = function() {
			my.it('isFoo', function() {
				my.expect(my.foo).toBe(true);
			});
		};
	});

	test('b testCase should have run 2 test cases', function() {
		assert.equal(bTestCaseCount, 2);
	});

	test('beforeEach is inherited', function() {
		assert.ok(b.instance().isA);
		assert.ok(b.instance().isB);
	});
});

define(function(require) {

    var assert = require('chai').assert;
    var testCase = require('../src/testCase');

    suite("testCase");

	/**
	 * Mocking Jasmine's basic API using Chai's assert API.
	 * describe, it and expect are globals.
	 */

	describe = function(name, callback) {
		suite(name);
		callback();
	};

	it = function(name, callback) {
		test(name, callback);
	};

	expect = function(expected) {
		return {
			toBe: function(actual) {
				assert.equal(expected, actual);
			}
		};
	};

	var bTestCaseCount;

	var a = testCase.subclass(function(that, my) {
		my.name = function() {
			return 'TestCase - A';
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

		// Keep track of the number of tests run.
		my.describe = function(name, callback) {
			bTestCaseCount = 0;
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

		my.initialize = function(spec) {
			my.super(spec);
			my.foo = true;
		};
	});

	test('b testCase should have run 2 test cases', function() {
		assert.equal(bTestCaseCount, 2);
	});
});

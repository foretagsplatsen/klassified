import testCase from "../../src/testCase.js";

describe("testCase", function () {
	let bTestCaseCount;

	let a = testCase.subclass(function (that, my) {
		my.name = function () {
			return "TestCase - A";
		};

		my.beforeEach = function () {
			that.isA = true;
		};

		my.isFooTest = function () {
			my.expect(my.foo).toBe(false);
		};

		my.isBarTest = function () {
			my.expect(my.bar).toBe(true);
		};

		my.initialize = function (spec) {
			my.super(spec);

			my.foo = false;
			my.bar = true;
		};
	});

	let b = a.subclass(function (that, my) {
		my.initialize = function (spec) {
			bTestCaseCount = 0;
			my.super(spec);
			my.foo = true;
		};

		my.beforeEach = function () {
			my.super();
			bTestCaseCount++;
			that.isB = true;
		};

		// Keep track of the number of tests run.
		my.describe = function (name, callback) {
			my.super(name, callback);
		};

		my.name = function () {
			return "TestCase - B";
		};

		my.isFooTest = function () {
			my.expect(my.foo).toBe(true);
		};
	});

	it("b testCase should have run 2 test cases", function () {
		expect(bTestCaseCount).toBe(2);
	});

	it("beforeEach is inherited", function () {
		expect(b.instance().isA).toBeTruthy();
		expect(b.instance().isB).toBeTruthy();
	});
});

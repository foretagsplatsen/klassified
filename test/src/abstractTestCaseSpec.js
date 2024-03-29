import testCase from "../../src/testCase.js";

let a = testCase.abstractSubclass((that, my) => {
	my.name = function () {
		return "Abstract test case";
	};

	my.createObject = function () {
		return "a";
	};

	my.shouldNotExecuteTestsTest = function () {
		expect(my.createObject()).toBe("b");
	};
});

const b = a.subclass((that, my) => {
	my.createObject = function () {
		return "b";
	};
});

export default b;

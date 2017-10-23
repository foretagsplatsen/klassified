import testCase from "../../src/testCase";

let a = testCase.abstractSubclass(function(that, my) {

	my.name = function() {
		return "Abstract test case";
	};

	my.createObject = function() {
		return "a";
	};

	my.shouldNotExecuteTestsTest = function() {
		expect(my.createObject()).toBe("b");
	};
});

let b = a.subclass(function(that, my) {

	my.createObject = function() {
		return "b";
	};
});

export default b;

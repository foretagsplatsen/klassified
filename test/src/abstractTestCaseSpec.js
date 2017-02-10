define([
	"src/testCase"
], function(testCase) {

	var a = testCase.abstractSubclass(function(that, my) {

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

	var b = a.subclass(function(that, my) {

		my.createObject = function() {
			return "b";
		};
	});

	return b;
});

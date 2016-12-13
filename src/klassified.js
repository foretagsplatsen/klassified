define([
	"./object",
	"./testCase",
	"./property",
	"./globalPropertyEventEmitter"
], function(object, testCase, property, globalPropertyEventEmitter) {
	return {
		object: object,
		testCase: testCase,
		property: property,
		propertyEventEmitter: globalPropertyEventEmitter
	};
});

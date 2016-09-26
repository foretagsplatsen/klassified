define([
	"./object",
	"./testCase",
	"./property",
	"./globalPropertyEventEmitter"
], function(object, testCase, property, propertyEventEmitter) {
	return {
		object: object,
		testCase: testCase,
		property: property,
		propertyEventEmitter: propertyEventEmitter
	};
});

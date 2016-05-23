require.config({
    paths: {
        'chai': '../bower_components/chai/chai'
    }
});

var testModules = [
    'subclassCreationTest',
	'initializationTest',
	'inheritanceTest',
	'superTest',
	'extensionTest',
	'allSubclassesTest',
	'classInheritanceTest',
	'classReferenceTest',
	'abstractSubclassTest',
	'getterSetterTest'
];

require(testModules, function () {
    if (window.mochaPhantomJS) {
        window.mochaPhantomJS.run();
    }
    else {
        //mocha.checkLeaks();
        mocha.run();
    }
});

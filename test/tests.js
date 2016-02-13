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
	'extensionTest'
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

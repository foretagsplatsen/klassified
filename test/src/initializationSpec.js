import object from "../../src/object.js";

describe("initialization", function() {

	it("initialize should be called upon object creation", function() {
		let initialized = false;

		let animal = object.subclass(function(that, my) {
			my.initialize = function() {
				initialized = true;
			};
		});

		expect(!initialized).toBe(true);
		animal();

		expect(initialized).toBe(true);
	});

	it("initialize should be called only once", function() {
		let initializeCalls = 0;

		let animal = object.subclass(function(that, my) {
			my.initialize = function() {
				initializeCalls += 1;
			};
		});

		let dog = animal.subclass(function(that, my) {
			my.initialize = function() {
				initializeCalls += 1;
			};
		});

		dog();

		expect(initializeCalls).toEqual(1);
	});

	it("can use overrides within initialize", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function() {
				that.foo();
			};

			that.foo = function() {
				that.bar = "animal";
			};
		});

		let dog = animal.subclass(function(that, my) {
			that.foo = function() {
				that.bar = "dog";
			};
		});

		let d = dog();
		let a = animal();

		expect(a.bar).toEqual("animal");
		expect(d.bar).toEqual("dog");
	});

	it("can call super from initialize", function() {
		let animal = object.subclass(function(that, my) {
			my.initialize = function() {
				my.super();
				that.foo = 1;
			};
		});

		let dog = animal.subclass(function(that, my) {
			my.initialize = function() {
				my.super();
				that.bar = 2;
			};
		});

		let d = dog();

		expect(d.foo).toEqual(1);
		expect(d.bar).toEqual(2);
	});

	it("initialization hooks are called in order", function() {
		// TODO: refactor that when
		// https://github.com/jasmine/jasmine/pull/1242 is merged.
		let spy = jasmine.createSpy("spy");

		let animal = object.subclass(function(that, my) {
			my.preInitialize = function() {
				my.super();

				expect(spy.calls.count()).toBe(0);
				spy();
			};

			my.initialize = function() {
				my.super();

				expect(spy.calls.count()).toBe(1);
				spy();
			};

			my.postInitialize = function() {
				my.super();

				expect(spy.calls.count()).toBe(2);
				spy();
			};
		});

		animal();

		expect(spy.calls.count()).toEqual(3);
	});
});

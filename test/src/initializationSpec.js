define(["src/object"], function(object) {

    describe("initialization", function() {

        it("initialize should be called upon object creation", function() {
            var initialized = false;

            var animal = object.subclass(function(that, my) {
                my.initialize = function() {
                    initialized = true;
                };
            });

            expect(!initialized).toBe(true);
            animal();
            expect(initialized).toBe(true);
        });

        it("initialize should be called only once", function() {
            var initializeCalls = 0;

            var animal = object.subclass(function(that, my) {
                my.initialize = function() {
                    initializeCalls += 1;
                };
            });

            var dog = animal.subclass(function(that, my) {
                my.initialize = function() {
                    initializeCalls += 1;
                };
            });

            dog();
            expect(initializeCalls).toEqual(1);
        });

        it("can use overrides within initialize", function() {
            var animal = object.subclass(function(that, my) {
                my.initialize = function() {
                    that.foo();
                };

                that.foo = function() {
                    that.bar = "animal";
                };
            });

            var dog = animal.subclass(function(that, my) {
                that.foo = function() {
                    that.bar = "dog";
                };
            });

            var d = dog();
            var a = animal();
            expect(a.bar).toEqual("animal");
            expect(d.bar).toEqual("dog");
        });

        it("can call super from initialize", function() {
            var animal = object.subclass(function(that, my) {
                my.initialize = function() {
                    my.super();
                    that.foo = 1;
                };
            });

            var dog = animal.subclass(function(that, my) {
                my.initialize = function() {
                    my.super();
                    that.bar = 2;
                };
            });

            var d = dog();
            expect(d.foo).toEqual(1);
            expect(d.bar).toEqual(2);
        });

        it("initialization hooks are called in order", function() {
            // TODO: refactor that when
            // https://github.com/jasmine/jasmine/pull/1242 is merged.
            var spy = jasmine.createSpy("spy");

            var animal = object.subclass(function(that, my) {
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
});

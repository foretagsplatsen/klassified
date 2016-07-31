define(["src/object"], function(object) {

    describe("super", function() {

        it("super can be called within public methods", function() {
            var animal = object.subclass(function(that, my) {
                my.initialize = function(spec) {
                    my.super();
                    my.name = spec.name;
                };
                that.getName = function() {
                    return my.name;
                };
            });

            var dog = animal.subclass(function(that, my) {
                that.getName = function() {
                    return "dog named " + that.super();
                };
            });

			var milou = dog.new({name: "milou"});

            expect(milou.getName()).toEqual("dog named milou");
        });

        it("super can be called within protected methods", function() {
            var animal = object.subclass(function(that, my) {
                my.initialize = function(spec) {
                    my.super();
                    my.name = spec.name;
                };

                that.toString = function() {
                    return my.getName();
                };

                my.getName = function() {
                    return my.name;
                };
            });

            var dog = animal.subclass(function(that, my) {
                my.getName = function() {
                    return "dog named " + my.super();
                };
            });

			var milou = dog.new({name: "milou"});

            expect(milou.toString()).toEqual("dog named milou");
        });

        it("super rebinds calls to that correctly", function() {
            var animal = object.subclass(function(that, my) {

                that.toString = function() {
                    return my.getName();
                };

                my.getName = function() {
                    return my.name;
                };
            });

            var dog = animal.subclass(function(that, my) {
                that.toString = function() {
                    return "a dog named: " + that.super();
                };

                my.getName = function() {
                    return "milou";
                };
            });

			var milou = dog.new();

            expect(milou.toString()).toEqual("a dog named: milou");
        });

        it("super can be used with arguments", function() {
            var animal = object.subclass(function(that, my) {

                that.foo = function(number) {
                    return number;
                };
            });

            var dog = animal.subclass(function(that, my) {
                that.foo = function(number) {
                    return that.super(number) + 1;
                };
            });

			var milou = dog.new();
            var foo = milou.foo(4);

            expect(foo).toEqual(5);
        });

		it("super should be uninstalled after being used", function() {
			var animal = object.subclass(function(that, my) {

				that.foo = function() {};
			});

			var dog = animal.subclass(function(that, my) {
				that.foo = function(number) {
					that.super();
				};
			});

			var milou = dog.new();
			milou.foo();

			var keys = Object.keys(milou);
			expect(keys).not.toContain("super");
		});

		it("super calls in inherited methods should bind super for each super call", function() {
			var foo = object.subclass(function(that, my) {
				that.foo = function() {
					return 1;
				};
			});

			var bar = foo.subclass(function(that, my) {
				that.foo = function() {
					return that.super() + 1;
				};
			});

			var baz = bar.subclass(function(that, my) {});

			expect(baz.new().foo()).toBe(2);
		});
    });
});

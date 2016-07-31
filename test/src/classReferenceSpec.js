define(["src/object"], function(object) {

    describe("class-reference", function() {

        it("Instance of object can access their class", function() {
            var o = object.new();

            expect(o.getClass()).toEqual(object);
        });

        it("Instances of subclasses of object reference the correct class", function() {
            var animal = object.subclass(function(that, my) {});

            var a = animal.new();

            expect(a.getClass()).toEqual(animal);
        });

        it("Instances of subclasses of subclasses refer to the correct class", function() {
            var animal = object.subclass(function(that, my) {});
            var dog = animal.subclass(function(that, my) {});

            var d = dog.new();

            expect(d.getClass()).toEqual(dog);
        });

        it("Can refer to class-side methods from an instance", function() {
            var animal = object.subclass(function(that, my) {
                that.foo = function() {
                    return that.getClass().foo();
                };
            });

            animal.class(function(that) {
                that.foo = function() {
                    return true;
                };
            });

            var a = animal.new();

            expect(a.foo()).toBe(true);
        });
    });
});

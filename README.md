# objectjs

A simple object model for JavaScript.

## Usage example:

```js
var animal = object.subclass(function(that, spec, my) {

    that.initialize = function() {
        my.name = spec.name;
    }

    that.getName = function() {
        return my.name;
    };
});

var dog = animal.subclass(function(that, spec, my) {

    that.getName = function() {
        return 'dog named' + that.super.getName();
    };
});
```

# ⚠ The project is archived. No further development is planned.

# Klassified [![Build Status](https://travis-ci.org/foretagsplatsen/klassified.svg?branch=master)](https://travis-ci.org/foretagsplatsen/klassified)

A simple object model for JavaScript.

Klassified provides a base class `object` that can be subclassed using its
`subclass` class method, as in the following example:

```js
var animal = object.subclass(function(that, my) {
    my.initialize = function(spec) {
        my.super(spec);
        my.name = spec.name;
    }
    that.getName = function() {
        return my.name;
    };
});

animal.class(function(that) {
    that.named = function(name) {
        return that({name: name});
    };
});

var dog = animal.subclass(function(that, my) {
    that.getName = function() {
        return 'dog named' + that.super();
    };
});
```

`that` represents the receiver (the instance or the class depending on the
context).

## Public and protected properties

Public methods are attached to the instance (`that`), while protected methods
are attached to `my`.

## Object creation

Instances can be created by calling a class function like the following:

```js
var milou = dog({name: 'milou'});
milou.getName(); // => 'milou
```

## Initialization

The `spec` literal object is passed to `my.initialize`, which is called upon
instance creation.

`my.super` should almost always be called from within `initialize`.

## Super calls

Klassified has support for super calls using either `that.super` for public
methods or `my.super` for protected methods.

## Default methods in `object`

`object` provides the following instance methods and properties:

- `that.klass` returns the class of the instance
- `my.subclassResponsibility` method throwing an exception because a method
  should have been overridden.
- `my.initialize` initialization method, takes a literal spec object.

`object` also provides the following class-side methods and properties:

- `object.subclasses` returns an array of the direct subclasess of a class.
- `object.allSubclasses` method that returns all the subclasess of a class.
- `object.subclass` method used to create a new subclass of a class.

## Abstract classes

Klassified supports abstract classes using `abstractSubclass`:

```js
var animal = object.abstractSubclass(function(that, my) {

    // [...]

});

var dog = animal.subclass(function(that, my) {

    // [...]

});

animal(); // => Error: Cannot instantiate an abstract class
dog(); // => New dog instance
```

## Singleton classes

Klassified support singleton classes using `singletonSubclass`:

```js
var service = object.singletonSubclass(function(that, my) {

    // [...]

});

service.instance(); // Return the single instance of the class
service(); // => Error: Cannot create new instances of a singleton class, use `instance` instead.
```

## Getters and setters generation

Klassified can generate getters and setters for protected properties on `my`, as
below:

```js
var animal = object.subclass(function(that, my) {
	my.initialize = function(spec) {
		my.name = spec.name;
	};

	my.get('name');
    my.set('name');
});

var a = animal();
a.setName('milou');
a.getName(); // => 'milou'
```

Custom getters and setters are also supported:

```js
var dog = animal.subclass(function(that, my) {
	my.get('name', function() {
        return 'A dog named ' + my.name;
    });
    my.set('name', function(value) {
        my.name = value.toUpperCase();
    });
});

var a = animal();
a.setName('milou');
a.getName(); // => 'A dog named MILOU'
```

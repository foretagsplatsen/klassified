define([
	"./object",
	"./propertiesEventEmitter",
	"./globalPropertyEventEmitter"
], function(object, propertiesEventEmitter, globalPropertyEventEmitter) {
	/**
	 * A property represent an observable attribute of an object, with optional
	 * getters and setters.
	 *
	 * @param{string} spec.owner - Instance on which the property is installed.
	 * @param{string} spec.name - Name of the property, which value of the same
	 * name is installed on `my` on the instance.
	 z     */
	object.extend(function(that, my) {

		that.onPropertyAccess = function(propName, listener) {
			var emitter = my.ensurePropertiesEventEmitter();
			emitter.onAccess(propName, listener);
		};

		that.onPropertyChange = function(propName, listener) {
			var emitter = my.ensurePropertiesEventEmitter();
			emitter.onChange(propName, listener);
		};

		my.property = function(propName, initialValue) {
			var value = initialValue;
			Object.defineProperty(my, propName, {
				configurable: true,
				enumerable: true,
				get: function() {
					emitPropertyAccess(propName);
					return value;
				},
				set: function(newValue) {
					value = newValue;
					emitPropertyChange(propName, value);
				}
			});
		};

		my.ensurePropertiesEventEmitter = function() {
			if (my.propertiesEventEmitter) {
				return my.propertiesEventEmitter;
			}

			my.propertiesEventEmitter = propertiesEventEmitter({
				instance: that
			});

			return my.propertiesEventEmitter;
		};

		function emitPropertyAccess(propName) {
			var emitter = my.ensurePropertiesEventEmitter();
			emitter.emitAccess(propName);
			globalPropertyEventEmitter.instance().emitAccess(that, propName);
		}

		function emitPropertyChange(propName, value) {
			var emitter = my.ensurePropertiesEventEmitter();
			emitter.emitChange(propName, value);
			globalPropertyEventEmitter.instance().emitChange(that, propName, value);
		}
	});
});

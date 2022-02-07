import object from "./object.js";

/**
 * Central property events emitter.
 *
 * All properties will trigger events when accessed or changed.
 */
export default object.singletonSubclass(function(that, my) {
	my.initialize = function(spec) {
		my.super(spec);
		my.accessListeners = [];
		my.changeListeners = [];
	};

	that.onAccess = function(listener) {
		my.accessListeners.push(listener);
	};

	that.onChange = function(listener) {
		my.changeListeners.push(listener);
	};

	that.emitAccess = function(instance, propName) {
		my.accessListeners.forEach(function(listener) {
			listener(instance, propName);
		});
	};

	that.emitChange = function(instance, propName, value) {
		my.changeListeners.forEach(function(listener) {
			listener(instance, propName, value);
		});
	};
});

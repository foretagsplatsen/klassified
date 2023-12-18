import object from "./object.js";

export default object.subclass(function (that, my) {
	my.initialize = function (spec) {
		my.super(spec);
		my.instance = spec.instance;

		my.accessListeners = {};
		my.changeListeners = {};
	};

	that.onAccess = function (propName, listener) {
		if (!my.accessListeners[propName]) {
			my.accessListeners[propName] = [];
		}
		if (my.accessListeners[propName].indexOf(listener) === -1) {
			my.accessListeners[propName].push(listener);
		}
	};

	that.onChange = function (propName, listener) {
		if (!my.changeListeners[propName]) {
			my.changeListeners[propName] = [];
		}
		if (my.changeListeners[propName].indexOf(listener) === -1) {
			my.changeListeners[propName].push(listener);
		}
	};

	that.emitAccess = function (propName) {
		if (!my.accessListeners[propName]) {
			return;
		}

		my.accessListeners[propName].forEach(function (listener) {
			listener(my.instance, propName);
		});
	};

	that.emitChange = function (propName, value) {
		if (!my.changeListeners[propName]) {
			return;
		}

		my.changeListeners[propName].forEach(function (listener) {
			listener(my.instance, propName, value);
		});
	};
});

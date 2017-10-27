define([
], function() {
	// Constructors
	function objectConstructor() {}
	function objectClassConstructor() {}
	function behaviorConstructor() {}
	function behaviorClassConstructor() {}
	function klassConstructor() {}
	function klassClassConstructor() {}
	function metaclassConstructor() {}
	function metaclassClassConstructor() {}

	// Subclass of
	behaviorConstructor.prototype = new objectConstructor();
	klassConstructor.prototype = new behaviorConstructor();
	metaclassConstructor.prototype = new behaviorConstructor();

	objectClassConstructor.prototype = new klassConstructor();
	behaviorClassConstructor.prototype = new objectClassConstructor();
	klassClassConstructor.prototype = new behaviorClassConstructor();
	metaclassClassConstructor.prototype = new behaviorClassConstructor();

	// Instance of
	var object = new objectClassConstructor();
	var behavior = new behaviorClassConstructor();
	var klass = new klassClassConstructor();
	var metaclass = new metaclassClassConstructor();

	// Metaclass instance of
	var objectClass = new metaclassConstructor();
	var behaviorClass = new metaclassConstructor();
	var klassClass = new metaclassConstructor();
	var metaclassClass = new metaclassConstructor();

	object.klass = objectClass;
	objectClass.klass = metaclass;
	behavior.klass = behaviorClass;
	behaviorClass.klass = metaclass;
	klass.klass = klassClass;
	klassClass.klass = metaclass;
	metaclass.klass = metaclassClass;
	metaclassClass.klass = metaclass;

	// Link to the superclass
	object.superclass = null;
	objectClass.superclass = klass;
	behavior.superclass = object;
	behaviorClass.superclass = objectClass;
	klass.superclass = behavior;
	klassClass.superclass = behaviorClass;
	metaclass.superclass = behavior;
	metaclassClass.superclass = behaviorClass;

	// Links to constructors
	object.esConstructor = objectConstructor;
	objectClass.esConstructor = objectClassConstructor;
	behavior.esConstructor = behaviorConstructor;
	behaviorClass.esConstructor = behaviorClassConstructor;
	klass.esConstructor = klassConstructor;
	klassClass.esConstructor = klassClassConstructor;
	metaclass.esConstructor = metaclassConstructor;
	metaclassClass.esConstructor = metaclassClassConstructor;

	// Basic methods

	behaviorConstructor.prototype.new = function() {
		return new this.esConstructor();
	};

	klassConstructor.prototype.subclass = function() {
		// Constructors
		function subClassConstructor() {}
		function subMetaclassConstructor() {}

		// Subclass of
		subClassConstructor.prototype = new this.esConstructor();
		subMetaclassConstructor.prototype = new this.klass.esConstructor();

		// Instance of
		let subClass = new subMetaclassConstructor();
		let subMetaclass = new metaclassConstructor();

		subClassConstructor.prototype.klass = subClass;
		subMetaclassConstructor.prototype.klass = subMetaclass;

		subClass.klass = subMetaclass;
		subMetaclass.klass = metaclass;

		// Link to the superclass
		subClass.superclass = this;

		// Links to constructors
		subClass.esConstructor = subClassConstructor;
		subMetaclass.esConstructor = subMetaclassConstructor;

		return subClass;
	};

	return {
		object,
		behavior,
		klass,
		metaclass
	};
});

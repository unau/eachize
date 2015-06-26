(this.UiApp ? nougat : require('nougat')).$(
  this.UiApp ? {g: this} : {g: global, m: module},
  function(glace) {
    'use strict';
    var asRep = (function(Inflector) {
      return function(names) {
	var target = this;
	if (typeof names == 'string') names = names.split(',');
	names.forEach(function(single) {
	  var plural = Inflector.pluralize(single);
	  var methodName = 'each' + Inflector.camelize(single);
	  target[methodName] = function(f) {
	    var hash = this[plural];
	    for (var key in hash) {
	      f(hash[key], key, this);
	    }
	    return this;
	  };
	});
      };
    })(glace.require('inflected-nougatized').Inflector);
    return {
      eachize: function(target, names) {
	asRep.call(target.prototype, names);
      }
    };
  });

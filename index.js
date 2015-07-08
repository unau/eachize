(this.XML ? nougat : require('nougat')).$(
  this.XML ? {g: this} : {g: global, m: module},
  function(glace) {
    'use strict';
    var asRep = (function(Inflector) {
      return function(names) {
	var target = this;
	if (typeof names == 'string') names = names.split(',');
	target._eachize = {
	  names: names,
	  funcs: {}
	};
	names.forEach(function(single) {
	  var plural = Inflector.pluralize(single);
	  var methodName = 'each' + Inflector.camelize(single);
	  target._eachize.funcs[single] =
	    target[methodName] = function(prefunc, mainfunc, postfunc) {
	      if ((! mainfunc) && (! postfunc)) {
		mainfunc = prefunc;
		prefunc = null;
	      }
	      var ctx = (typeof prefunc == 'function') ? prefunc() : {};
	      var hash = this[plural];
	      for (var key in hash) {
		mainfunc(hash[key], key, ctx, this);
	      }
	      return (typeof postfunc == 'function') ? postfunc(ctx) : this;
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

(function(){
  'use strict';
  require('inflector');
  var asRep = (function() {
    return function(names) {
      var target = this;
      if (typeof names == 'string') names = names.split(',');
      names.forEach(function(single) {
	var plural = single.plural();
	var methodName = 'each' + single.camelize();
	target[methodName] = function(f) {
	  var hash = this[plural];
	  for (var key in hash) {
	    f(hash[key], key, this);
	  }
	  return this;
	};
      });
    };
  })();
  module.exports = function(target, names) {
    asRep.call(target.prototype, names);
  };
})();

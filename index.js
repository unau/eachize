(this.XML ? nougat : require('nougat')).$(
  this.XML ? {g: this} : {g: global, m: module},
  function(glace) {
    'use strict';
    function makefunc(plural, target) {
      return function(prefunc, mainfunc, postfunc) {
        if ((! mainfunc) && (! postfunc)) {
          mainfunc = prefunc;
          prefunc = null;
        }
        var hash = target || this[plural];
        var ctx = (typeof prefunc == 'function') ? prefunc() : {};
        for (var key in hash) {
          mainfunc(hash[key], key, ctx, target || this);
        }
        return (typeof postfunc == 'function') ? postfunc(ctx) : this;
      };
    }
    var asRep = (function(Inflector) {
      return function(names) {
        var target = this;
        if (typeof names == 'string') names = names.split(',');
        target._eachize = {};
        names.forEach(function(single) {
          var plural = Inflector.pluralize(single);
          var methodName = 'each' + Inflector.camelize(single);
          target[methodName] = makefunc(plural);
          target._eachize[single] = {
            func: target[methodName]
          };
        });
      };
    })(glace.require('inflected-nougatized').Inflector);
    return {
      eachize: function(target, names) {
        if (typeof target.prototype == 'undefined') {
          return makefunc(null, target);
        } else {
          asRep.call(target.prototype, names);
        }
      }
    };
  });

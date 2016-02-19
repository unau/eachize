(this.XML ? nougat : require('nougat')).$(
  this.XML ? {g: this} : {g: global, m: module},
  function(glace) {
    'use strict';
    var asRep = (function(Inflector) {
      return function(names) {
        var target = this;
        if (typeof names == 'string') names = names.split(',');
        target._eachize = {};
        names.forEach(function(single) {
          var plural = Inflector.pluralize(single);
          var methodName = 'each' + Inflector.camelize(single);
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
          target._eachize[single] = {
            func: target[methodName]
          };
        });
      };
    })(glace.require('inflected-nougatized').Inflector);
    return {
      eachize: function(target, names) {
        var type = typeof target.prototype;
        if (type == 'undefined') {
          return function(prefunc, mainfunc, postfunc) {
            if ((! mainfunc) && (! postfunc)) {
              mainfunc = prefunc;
              prefunc = null;
            }
            var ctx = (typeof prefunc == 'function') ? prefunc() : {};
            for (var key in target) {
              mainfunc(target[key], key, ctx, target);
            }
            return (typeof postfunc == 'function') ? postfunc(ctx) : this;
          };
        } else {
          asRep.call(target.prototype, names);
        }
      }
    };
  });

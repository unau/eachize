(this.XML ? nougat : require('nougat')).$(
  this.XML ? {g: this} : {g: global, m: module},
  function(glace) {
    'use strict';
    function makefunc(_eachize, hashName, hash) {
      return (function(_eachize, hashName, hash0) {
	  return function() {
	    /**
             * eachFactor(mainfunc)
             * eachFactor(clue, mainfunc)
             * eachFactor(prefunc, mainfunc, postfunc)
             * eachFactor(clue, prefunc, mainfunc, postfunc)
             */
            var arg = (function(a, h) {
	      a = (function(r) {
		for (var i in a) {
		  r.push(a[i]);
		}
		return r;
	      })([]);
	      if (typeof a[0] == 'string') {
		h.clue = a.shift();
	      }
	      if (a.length > 1) {
		h.prefunc = a[0];
		h.mainfunc = a[1];
		h.postfunc = a[2];
	      } else {
		h.prefunc = null;
		h.mainfunc = a[0];
		h.postfunc = null;
	      }
	      return h;
	    })(arguments, {});
            var obj;
            if (typeof hash0 == 'undefined') {
              obj = this;
	      hash = this[arg.clue ? _eachize.clues[arg.clue].hashName : hashName];
	    } else {
	      hash = hash0;
              obj = hash;
	    }
            var ctx = (typeof arg.prefunc == 'function') ? arg.prefunc() : {};
            for (var key in hash) {
              arg.mainfunc(hash[key], key, ctx, obj);
            }
            return (typeof arg.postfunc == 'function') ? arg.postfunc(ctx) : this;
	  };
      })(_eachize, hashName, hash);
    }
    var asRep = (function(Inflector) {
      return function(names) {
        var target = this;
        var spec = (function(names, spec, m) {
          var re = /(\w+)(\(([\w,]+)\))?/g;
          while (m = re.exec(names)) {
            spec[m[1]] = { clues : m[3] ? m[3].split(','): [''] };
	  }
          return spec;
        })(names, {});
        target._eachize = {};
        for (var factor in spec) {
          var camelized = Inflector.camelize(factor);
	  target._eachize[factor] = {
	    single: factor,
	    plural: Inflector.pluralize(factor),
	    funcs: {
              each: {
		name: 'each' + camelized
	      },
              populate: {
		name:  'populateEach' + camelized
	      },
	    },
	    clues: {}
	  };
          spec[factor].clues.forEach(function(clue, i) {
	    target._eachize[factor].clues[clue] = {
	      index: i,
	      clue: clue,
              hashName:  target._eachize[factor].plural + 'By' + Inflector.camelize(clue)
	    };
          });
	  target[target._eachize[factor].funcs.each.name] =
	    target._eachize[factor].funcs.each.func =
	    makefunc(target._eachize[factor], target._eachize[factor].plural);
          target[target._eachize[factor].funcs.populate.name] =
	    target._eachize[factor].funcs.populate.func = 
	    (function(clues) {
	      return function(fromClue, toClue) {
	        var fromSpec = clues[fromClue];
	        var toSpec = clues[toClue];
		if (! fromSpec || ! toSpec) return;
		if (! this[toSpec.hashName]) this[toSpec.hashName] = {};
	        for (var key in this[fromSpec.hashName]) {
		  var value = this[fromSpec.hashName][key];
		  this[toSpec.hashName][value[toClue]] = value;
		}
		return true;
	      };
	    })(target._eachize[factor].clues);
        }
      };
    })(glace.require('inflected-nougatized').Inflector);
    return {
      eachize: function(target, names) {
        if (typeof target.prototype == 'undefined') {
          return makefunc(null, null, target);
        } else {
          asRep.call(target.prototype, names);
        }
      }
    };
  });

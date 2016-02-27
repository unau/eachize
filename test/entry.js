var assert = require('assert');
var eachize = require('../').eachize;

var Album = function() {
  this.init();
};
eachize(Album, 'photo(title,id),category');
Album.prototype.init = function() {
  this.photos = {
    first: {
      id: 'p01',
      title: 'first',
      image: ' photo1'
    },
    second: {
      id: 'p02',
      title: 'second',
      image: 'photo2'
    }
  };
  this.photosByTitle = this.photos;
  this.categories = {
    portrait: 'human',
    landscape: 'nature'
  };
};

var album = new Album();

describe('Album', function() {
  it('has internal hash named _eachize', function() {
    assert.equal(typeof album._eachize, 'object');
  });
  it('has eachPhoto', function() {
    assert.equal(typeof album.eachPhoto, 'function');
  });
  it('has eachPhoto and the function is same as _eachize.photo.funcs.each.func', function() {
    assert.equal(album.eachPhoto, album._eachize.photo.funcs.each.func);
  });
  it('has eachCategory', function() {
    assert.equal(typeof album.eachCategory, 'function');
  });
  it('has eachCategory and the function is same as _eachize.category.funcs.each.func', function() {
    assert.equal(album.eachCategory, album._eachize.category.funcs.each.func);
  });
  it('provide each photo element to the repeated function', function() {
    var str = '';
    album.eachPhoto(function(photo, key, ctx, x_album) {
      var s = '[' + key + ':' + photo.id + ':' + (x_album == album) + ']';
      if (!s) {
        str = s;
      } else if (key == 'first') {
	str = s + str;
      } else {
        str = str + s;
      }
    });
    assert.equal(str, '[first:p01:true][second:p02:true]');
  });
  it('provide each cagoriry element to the repeated function', function() {
    var actual = '';
    album.eachCategory(function(category, key, ctx, x_album) {
      var s = '[' + key + ':' + category + ':' + (x_album == album) + ']';
      if (!s) {
        actual = s;
      } else if (key == 'portrait') {
	actual = s + actual;
      } else {
        actual = actual + s;
      }
    });
    assert.equal(actual, '[portrait:human:true][landscape:nature:true]');
  });
  it('provide "each function" that return the target itself', function() {
    assert.equal(album, album.eachPhoto(function(photo) { photo; }));
  });
  it('provide "each function" that takes three arguments', function() {
    var actual = album.eachCategory(
      function() { return { str: '' }; },
      function(category, key, ctx, x_album) {
	var s = '[' + key + ':' + category + ':' + (x_album == album) + ']';
	if (! ctx.str) {
          ctx.str = s;
	} else if (key == 'portrait') {
	  ctx.str = s + ctx.str;
	} else {
          ctx.str = ctx.str + s;
	}
      },
      function(ctx) { return '<' + ctx.str + '>' ; }
    );
    assert.equal(actual, '<[portrait:human:true][landscape:nature:true]>');
  });
  it('provides "populate function"', function() {
    album.populateEachPhoto('title', 'id');
    assert.equal(album.photosByTitle.first, album.photosById.p01);
  });
  it('provide "each function" that takes two arguments', function() {
    var actual = '';
    album.eachPhoto(
      'id',
      function(photo, id, ctx, x_album) {
        var s = '[' + id + ':' + photo.title + ':' + (x_album == album) + ']';
	if (! actual) {
          actual = s;
	} else if (id == 'p01') {
	  actual = s + actual;
	} else {
          actual = actual + s;
	}
      }
    );
    assert.equal(actual, '[p01:first:true][p02:second:true]');
  });
  it('provide "each function" that takes four arguments', function() {
    var actual = album.eachPhoto(
      'id',
      function() { return { str: '' }; },
      function(photo, id, ctx, x_album) {
        var s = '[' + id + ':' + photo.title + ':' + (x_album == album) + ']';
	if (! ctx.str) {
          ctx.str = s;
	} else if (id == 'p01') {
	  ctx.str = s + ctx.str
	} else {
          ctx.str = ctx.str + s;
	}
      },
      function(ctx) { return '<' + ctx.str + '>' ; }
    );
    assert.equal(actual, '<[p01:first:true][p02:second:true]>');
  });
});

var albums = {
  trip: { name: 'trip1'  },
  job: { name: 'job1'  }
};

describe('eachize for a simple hash', function() {
  it('works', function() {
    var actual =
        eachize(albums)(function() { return { str: '[:' }; },
                        function(album, key, ctx, x_albums) {
                          ctx.str += '(' + key + ':' + album.name + ':' + x_albums[key].name.charAt(0) + '):';
                        },
                        function(ctx) { return ctx.str + ']'; });
    assert(actual == '[:(trip:trip1:t):(job:job1:j):]' ||
           actual == '[:(job:job1:j):(trip:trip1:t):]');
  });
});

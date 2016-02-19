var assert = require('assert');
var eachize = require('../').eachize;

var Album = function() {
  this.init();
};
eachize(Album, 'photo,category');
Album.prototype.init = function() {
  this.photos = {
    'first': 'photo1',
    'second': 'photo2'
  };
  this.categories = {
    'portrait': 'human',
    'landscape': 'nature'
  };
};

var album = new Album();

describe('Album', function() {
  it('has internal hash named _eachize', function() {
    assert(typeof album._eachize == 'object');
  });
  it('has eachPhoto', function() {
    assert(typeof album.eachPhoto == 'function');
  });
  it('has eachPhoto and the function is same as _eachize.photo.func', function() {
    assert(album.eachPhoto == album._eachize.photo.func);
  });
  it('has eachCategory', function() {
    assert(typeof album.eachCategory == 'function');
  });
  it('has eachCategory and the function is same as _eachize.category.func', function() {
    assert(album.eachCategory == album._eachize.category.func);
  });
  it('provide each photo element to the repeated function', function() {
    album.eachPhoto(function(photo, key, ctx, x_album) {
      assert((key == 'first' && photo == 'photo1' && x_album == album) ||
             (key == 'second' && photo == 'photo2' && x_album == album)
      );
    });
  });
  it('provide each cagoriry element to the repeated function', function() {
    album.eachCategory(function(category, key, ctx, x_album) {
      assert((key == 'portrait' && category == 'human' && x_album == album) ||
             (key == 'landscape' && category == 'nature' && x_album == album)
      );
    });
  });
  it('provide "each function" that return the target itself', function() {
    assert(album == album.eachPhoto(function(photo) { photo; }));
  });
  it('provide "each function" that takes three arguments', function() {
    var actual =
        album.eachCategory(function() { return { str: '[:' }; },
                           function(category, key, ctx, x_album) {
                             ctx.str += '(' + key + ':' + category + '):';
                           },
                           function(ctx) { return ctx.str + ']' ; });
    assert(actual == '[:(portrait:human):(landscape:nature):]' ||
           actual == '[:(landscape:nature):(portrait:human):]');
  });
});

var albums = {
  trip: { name: 'trip'  },
  job: { name: 'job'  }
};

describe('eachize for a simple hash', function() {
  it('works', function() {
    var actual =
        eachize(albums)(function() { return { str: '[:' }; },
                        function(album, key, ctx, albums) {
                          ctx.str += '(' + key + ':' + album.name + '):';
                        },
                        function(ctx) { return ctx.str + ']' ; });
    assert(actual == '[:(trip:trip):(job:job):]' ||
           actual == '[:(job:job):(trip:trip):]');
  });
});

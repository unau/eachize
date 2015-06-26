var assert = require('assert');
var eachize = require('../').eachize;

var Album = function() {
  this.init();
};
eachize(Album, 'photo');
Album.prototype.init = function() {
  this.photos = {
    'first': 'FIRST',
    'second': 'SECOND',
  };
};

var album = new Album();

describe('Album', function() {
  it('has eachPhoto', function() {
    assert(typeof album.eachPhoto == 'function');
  });
  it('eachPhoto', function() {
    album.eachPhoto(function(photo, key, x_album) {
      assert((key == 'first' && photo == 'FIRST') ||
	     (key == 'second' && photo == 'SECOND')
      );
    });
  });
});

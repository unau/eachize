var assert = require('assert');
var eachize = require('../');

var Album = function() {
  this.init();
};
eachize(Album, 'image');
Album.prototype.init = function() {
  this.images = {
    'first': 'FIRST',
    'second': 'SECOND',
  };
};

var album = new Album();

describe('Album', function() {
  it('has eachImage', function() {
    assert(typeof album.eachImage == 'function');
  });
  it('eachImage', function() {
    album.eachImage(function(image, key, x_album) {
      assert((key == 'first' && image == 'FIRST') ||
	     (key == 'second' && image == 'SECOND')
      );
    });
  });
});

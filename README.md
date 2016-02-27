# eachize [![Build Status](https://travis-ci.org/unau/eachize.svg?branch=master)](https://travis-ci.org/unau/eachize) [![Coverage Status](https://coveralls.io/repos/unau/eachize/badge.svg)](https://coveralls.io/r/unau/eachize) [![Dependency Status](https://david-dm.org/unau/eachize.svg)](https://david-dm.org/unau/eachize)

mixin iteration functions

## Guide

### Basic usage
**eachize** provides iteration functions like Array.prototype.forEach() to a container instance.

we assume an `Album` class defined as below:
```javascript
var Album = function() {
  this.init();
};
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
```
if we use **eachize**, we can use iteration functions `eachPhoto()` and `eachCategory()` with instances of `Album` class.
```javascript
var eachize = require('eachize').;
eachize(Album, 'photo,category');

var album = new Album();
album.eachPhoto(function(photo, key) {
  console.log(key, photo);
})
```

### Use an iteration function with three functions as arguments
for convinience, **eachize** iteration functions can takes three functions as arguments, like below:
```javascript
var report = album.eachCategory(
  function() { return { str: '[:' }; },
  function(category, key, ctx, x_album) {
    ctx.str += '(' + key + ':' + category + '):';
  },
  function(ctx) { return ctx.str + ']' ; });
```

* the first function : is the initializing function.
the return value of this function is used as the context of the iteration.
* the second functin : is an iteration function. the third argument of
this function is the context.
* the third function : is the finalizeing function. the argument of
this function is the context. and, the return value of this function is
the return value of the outer function, in this case it is `eachCategory()`.

###  Specify keys for a container
you can specify two or more keys for a container.
```javascript
eachize(Album, 'photo(title,id),category');
```
in this case, the two keys named `title` and `id` are specified for
the container `protos`.
and, you can specify the key as a first argument, like below:
```javascript
album.eachPhoto('title' func); // with album.photosByTitle
album.eachPhoto('id' preFunc, mainFunc, postFunc);
  // with album.photsoById
```

you can use a population function.
```javascript
album.populateEachPhoto('title', 'id');
console.log(album.photosById);
/*--*
 {
  p01: {
    id: 'p01',
    title: 'first',
    image: ' photo1'
  },
  p02: {
    id: 'p02',
    title: 'second',
    image: 'photo2'
  }
 *--*/ 
```

### For a plain hash
you can use **eachize** for simple/plain hashes, like as below:
```javascript
var albums = {
  trip: { name: 'trip1'  },
  job: { name: 'job1'  }
};

var report = eachize(albums)(
  function() { return { str: '[:' }; },
  function(album, key, ctx, x_albums) {
    ctx.str += '(' + key + ':' + album.name + '):';
  },
  function(ctx) { return ctx.str + ']'; }
);
```

## Release History

## License
Copyright (c) 2015 Takeyuki Kojima
Licensed under the MIT license.

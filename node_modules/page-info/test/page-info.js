var test = require('simple-test');
var pageInfo = require('../index');

var google = 'google.com';
var baidu = 'www.baidu.com';
var designmodo = 'http://designmodo.com/long-shadows-design/';
var stackoverflow = 'http://stackoverflow.com/questions/18881982/how-can-i-get-all-the-doc-ids-in-mongodb/18883039?noredirect=1#comment27890387_18883039';
var mobify = 'http://www.mobify.com/blog/beginners-guide-to-http-cache-headers/';

test(google, function (done) {
  pageInfo(google, function (page) {
    console.log('icon', page.icon())
    console.log('favicon', page.favicon())
    console.log('shortcutIcon', page.shortcutIcon())
    console.log('title', page.title())
    console.log('thumbnail', page.thumbnail())
    console.log('firstImg', page.firstImg())
    done();
  }, function (err) {
    console.log('err', err);
  });
});

test(baidu, function (done) {
  pageInfo(baidu, function (page) {
    console.log('icon', page.icon())
    console.log('favicon', page.favicon())
    console.log('shortcutIcon', page.shortcutIcon())
    console.log('title', page.title())
    console.log('thumbnail', page.thumbnail())
    console.log('firstImg', page.firstImg())
    done();
  }, function (err) {
    console.log('err', err);
  });
});

test(designmodo, function (done) {
  pageInfo(designmodo, function (page) {
    console.log('icon', page.icon())
    console.log('favicon', page.favicon())
    console.log('shortcutIcon', page.shortcutIcon())
    console.log('title', page.title())
    console.log('thumbnail', page.thumbnail())
    console.log('firstImg', page.firstImg())
    done();
  }, function (err) {
    console.log('err', err);
  });
});

test(stackoverflow, function (done) {
  pageInfo(stackoverflow, function (page) {
    console.log('icon', page.icon())
    console.log('favicon', page.favicon())
    console.log('shortcutIcon', page.shortcutIcon())
    console.log('title', page.title())
    console.log('thumbnail', page.thumbnail())
    console.log('firstImg', page.firstImg())
    done();
  }, function (err) {
    console.log('err', err);
  });
});

test(mobify, function (done) {
  pageInfo(mobify, function (page) {
    console.log('icon', page.icon())
    console.log('favicon', page.favicon())
    console.log('shortcutIcon', page.shortcutIcon())
    console.log('title', page.title())
    console.log('thumbnail', page.thumbnail())
    console.log('firstImg', page.firstImg())
    done();
  }, function (err) {
    console.log('err', err);
  });
});

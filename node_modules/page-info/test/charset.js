var pageInfo = require('../index');
var test = require('simple-test');

test('Big5', function (done) {
  var url = 'http://www.google.com.hk/';

  pageInfo(url, function (page) {
    console.log('icon', page.icon())
    console.log('favicon', page.favicon())
    console.log('shortcutIcon', page.shortcutIcon())
    console.log('title', page.title())
    console.log('description', page.description())
    // console.log('bodyText', page.bodyText())
    console.log('thumbnail', page.thumbnail())
    console.log('firstImg', page.firstImg())
    done();
  }, function (err) {
    console.log('err', err);
  });
});


test('gb2312', function (done) {
  var url = 'http://www.cr173.com/tags_GB2312.html';

  pageInfo(url, function (page) {
    console.log('icon', page.icon())
    console.log('favicon', page.favicon())
    console.log('shortcutIcon', page.shortcutIcon())
    console.log('title', page.title())
    console.log('description', page.description())
    // console.log('bodyText', page.bodyText())
    console.log('thumbnail', page.thumbnail())
    console.log('firstImg', page.firstImg())
    done();
  }, function (err) {
    console.log('err', err);
  });
});

test('iso-8859-1', function (done) {
  var url = 'http://www.lemonde.fr/';

  pageInfo(url, function (page) {
    console.log('icon', page.icon())
    console.log('favicon', page.favicon())
    console.log('shortcutIcon', page.shortcutIcon())
    console.log('title', page.title())
    console.log('description', page.description())
    // console.log('bodyText', page.bodyText())
    console.log('thumbnail', page.thumbnail())
    console.log('firstImg', page.firstImg())
    done();
  }, function (err) {
    console.log('err', err);
  });
});

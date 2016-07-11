var cheerio = require('cheerio');

exports = module.exports = function (html) {
  var url = this;
  var $ = cheerio.load(html);

  function absolute(address) {
    // case 'favicon.ico'
    // case '/favicon.ico'
    // case '//cdn.sstatic.net/stackoverflow/img/favicon.ico'
    // case 'http://site.com/favicon.ico'
    if (address.indexOf('http') === 0) {
      return address;
    }

    if (address.indexOf('//') === 0) {
      return url.protocol + address;
    }

    if (address.indexOf('/') === 0) {
      return url.protocol + '//' + url.host + address;
    }

    address = address.replace(/^\//, '');
    return url.href + '/' + address;
  }

  var page = function () {
    return this;
  }.call({});

  page.favicon = function () {
    return absolute('/favicon.ico');
  }

  page.icon = function () {
    var $els = $('link[rel="icon"]');
    var href = $els.length ? $els.attr('href') : undefined;
    return href && absolute(href);
  }

  page.appleTouchIconPrecomposed = function () {
    var $el = $('link[rel~="apple-touch-icon-precomposed"]');
    var href = $el.length ? $el.attr('href') : undefined;
    return href && absolute(href);
  }

  page.appleTouchIcon = function () {
    var $el = $('link[rel~="apple-touch-icon"]');
    var href = $el.length ? $el.attr('href') : undefined;
    return href && absolute(href);
  }

  page.shortcutIcon = function () {
    var $els = $('link[rel="shortcut icon"]');
    var href = $els.length ? $els.attr('href') : undefined;
    return href && absolute(href);
  }

  page.title = function () {
    return $('title').text();
  }

  page.description = function () {
    return $('meta[name="description"]').attr('content');
  }

  page.bodyText = function () {
    return $('body').text();
  }

  page.firstParagraphText = function () {
    return $('body p:first-child').text();
  }

  page.firstDivText = function () {
    return $('body div:first-child').text();
  }

  page.firstImg = function () {
    var $el = $('body img:first-child');
    var src = $el.length ? $el.attr('src') : undefined;
    return src && absolute(src);
  }

  page.thumbnail = function () {
    var srcs = []

    $('body img').each(function (i, item) {
      var src = $(item).attr('src');

      if (src === undefined) return;
      if (src === '') return;
      srcs.push(src);
    });

    for (var i = 0; i < srcs.length; i++) {
      if (srcs[i].match(/\.(jpg|jpeg|png|gif)$/)) return absolute(srcs[i]);
    }

    return undefined;
  }

  return page;
}

exports.regex = function (html) {
  var page = function () {
    return this;
  }.call(Object.create(new String(html)));

  page.shortcutIcon = function (callback) {
    var regex = /<link rel=['"]shortcut icon['"] href=['"](.*)['"] \/>/;
    var match = html.match(regex);
    return match && match[1];
  }

  page.icon = function (callback) {
    var regex = /<link rel=['"]icon['"] href=['"](.*)['"] \/>/;
    var match = html.match(regex);
    return match && match[1];
  }

  page.title = function (callback) {
    var regex = /<title>(.*)<\/title>/;
    var match = html.match(regex);
    return match && match[1];
  }

  page.description = function (callback) {
    var regex = /<meta name=['"]description['"] content=['"](.*)['"]\/>/;
    var match = html.match(regex);
    return match && match[1];
  }

  page.thumbnail = function (callback) {

  }

  return page;
}
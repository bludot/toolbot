page-info
==========

A simple page info taker.


## Installation
```bash
npm install page-info
```

## Features
- follow `301` `302` redirection

## Quick Start
```javascript
var pageInfo = require('page-info');

pageInfo('google.com', function (page) {

  log(page.icon())
  log(page.favicon())
  log(page.shortcutIcon())

  log(page.title())
  log(page.description())
  log(page.bodyText())
  log(page.firstDivText())
  log(page.firstParagraphText())

  log(page.thumbnail())
  log(page.firstImg())

});
```


## API

## License

  MIT
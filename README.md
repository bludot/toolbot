## Toolbot

A irc bot that can have various commands. Built with nodejs using sequelize and node-irc. (soon to change node-irc to my custom irc module).

## Usage

It is a project on itself so just git clone and run the bot.js. I use pm2:

``` javascript
pm2 start bot.js
```

## Main commands

```
$load <room> <command> | <command>
$unload <command>
$login <password> //note: only do this in pm
```

More commands comming. 

## More important information

The commands are all stored in a database. Modify db.js to be any database you want. In the cmds folder you will see the basic commands I have already written.

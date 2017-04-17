API
===

This library provides IRC client functionality

Connect
----------

.. js:function:: irc.connect(options)

    Connects to an irc server.
    .. code-block:: json
    ::

	    {
	        server: "irc.synirc.net",
	        port: 6667,
	        channels: ["#spp"],
	        nick: "Nyanko_pureirc"+new Date().getUTCMilliseconds()+"",
	        realName: "Nyanko_pureirc"+new Date().getUTCMilliseconds()+"",
	        debug: true
	    }

    
    ``server``		:   The irc server url

    ``port``		:   The irc server port
    
    ``channels``	:   Array of channels to join
    
    ``nick``		:   Nick of user
    
    ``realName``	:   Real name of user
    
    ``debug``		:   Wether to show logs or not

AddListener
-------------

.. js:function:: irc.addListener(listener, function(msg){})
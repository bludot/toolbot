var w = function(client, db, channel) {
    var fetch = require('node-fetch');
    function isInt(value) {
          return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
    }
    var fetchWeather = function(data) {
        return fetch('https://api.openweathermap.org/data/2.5/weather?units=metric&'+data.search+'&appid=7f90d57565a7461549999bf4b9ce00bd')
            .then(function(res) {
                return res.json();
            }).then(function(json) {
                console.log(json);
                return json;
            });
    };
    var CtoF = function(temp) {
       return temp * 9 / 5 + 32;
    }
    return function(from, to, args) {
        var args = Array.prototype.slice.call(arguments).slice(2);
        console.log(args);
        var data = {};
        if(isInt(args[0])) {
            data.search = 'zip='+args[0]+((args[1] && args.length < 4) ? ','+args[1] : '');
        } else {
            data.search = 'q='+args[0]+((args[1] && args.length < 4) ? ','+args[1] : '');
        }
        fetchWeather(data).then(function(data) {
           /* "main": {
            "temp": 280.32,
                "pressure": 1012,
                "humidity": 81,
                "temp_min": 279.15,
                "temp_max": 281.15
            },*/
            var get = {
                place: data.name+','+data.sys.country,
                temp: data.main.temp+"C/"+CtoF(data.main.temp)+"F",
                text: data.weather[0].main+"/"+data.weather[0].description,
                pressure: data.main.pressure+"mb",
                maxTemp: data.main.temp_max+"C/"+CtoF(data.main.temp_max)+"F",
                minTemp: data.main.temp_min+"C/"+CtoF(data.main.temp_min)+"F"
            }

            client.say(channel, ("\u0002+"+get.place+"\u0002::\u0002Conditions:\u0002"+get.text+"::\u0002Temperature:\u0002"+get.temp+"::\u0002Pressure:\u0002"+get.pressure));
        });
    }
};

exports.w = w;

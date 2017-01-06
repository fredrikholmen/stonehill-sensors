var sensorLib = require("node-dht-sensor");
var mysql = require('mysql');
var moment = require('moment-timezone');

var pool =  mysql.createPool({
    host: '127.0.0.1',
    database: 'measurepower',
    user: 'root',
    password: 'summer',
    charset: 'utf8'
  });   


function execQuery(query, data, callback) {
        pool.getConnection(function(err, conn) {
            if (err) {
                console.log(err);
                callback(err, null);
                throw err;
                return;
            }
            conn.query(query, data, function(err, result) {
                callback(err, result);
                conn.release();
            });                

        });
    };

var sensor = {
    sensors: [ {
        name: "Basement",
        id: 2,
        type: 11,
        pin: 17
    } ],
    read: function() {
        for (var a in this.sensors) {
            var b = sensorLib.readSpec(this.sensors[a].type, this.sensors[a].pin);
            var query = "INSERT INTO temperature (`datetime`, `sensor`, `temperature`, `humidity`) VALUES (?,?,?,?);";
		var myDate = moment().tz("Europe/Stockholm").format('YYYY-MM-DD HH:mm:ss');

		console.log([myDate, this.sensors[a].id, b.temperature.toFixed(1), b.humidity.toFixed(1)]);
            execQuery(
                query, 
                [myDate, this.sensors[a].id, b.temperature.toFixed(1)*1, 1*b.humidity.toFixed(1)], 
                function(err, result) {
                    if (err) {
                        console.error(new Date() + "[ERROR] " + err);
                        throw err;
                    }
                    return;
                    console.log(this.sensors[a].name + ": " + 
              b.temperature.toFixed(1) + "C, " + 
              b.humidity.toFixed(1) + "%");
                }
                );
            
        }
        setTimeout(function() {
            sensor.read();
        }, 60000);
    }
};

sensor.read();

var mysql = require('mysql');
var ds18b20 = require('ds18b20');
var moment = require('moment-timezone');
                                                                                
var pool = mysql.createPool({
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
var interval = 60000; 
var query = "INSERT INTO temperature (`datetime`, `sensor`, `temperature`, `humidity`) VALUES (?,?,?,?);"; 


//initiate interval timer
    setInterval(function () {
 
            ds18b20.temperature('28-041623924aff', function (err, value) {
                var myDate = 
moment().tz("Europe/Stockholm").format('YYYY-MM-DD HH:mm:ss');
                execQuery(
                	query,
                	[myDate, 1, value, 0],
                	function(err, result) {
	                    if (err) {
	                        console.error(new Date() + "[ERROR] " + 
err);
	                        throw err;
	                    }                                     
	                    console.log("Outdoor"+ ": " + value + "C");
	                    return;
	                });
            });
    }, interval);

#!/usr/bin/env python
 
# Made by Fredrik Holmen 2016 (@fredrikh)

# Use Adafruit linux dist as they have allready added Gpio and spi support
# http://learn.adafruit.com/adafruit-raspberry-pi-educational-linux-distro/overview

 
import RPi.GPIO as GPIO, time, os      
import sys
import MySQLdb as mdb
import Queue
from datetime import datetime, timedelta

q = Queue.Queue()

def Writewatt (timestamp):
    con = None
    try:
        con = mdb.connect('localhost', 'root', 'summer', 'measurepower');
        cur = con.cursor()
        datetime = int(round(timestamp/1000))
        cur.execute("INSERT INTO measurepower.watthours (id, datetime, lightvalue) VALUES (NULL, FROM_UNIXTIME('%s'), '%s')" % (datetime, timestamp))
        con.commit()
    except mdb.Error, e:
        print "Error %d: %s" % (e.args[0],e.args[1])
        sys.exit(1)
    finally:        
        if con:    
            con.close()

def saveBlink(channel):
    q.put(int(round(time.time() * 1000)))
    return

GPIO.setmode(GPIO.BCM)

GPIO.setup(24, GPIO.IN, pull_up_down=GPIO.PUD_UP)
GPIO.add_event_detect(24, GPIO.FALLING, callback=saveBlink, bouncetime=80)

print "Waiting for blinks on port 24"  
var = 1

try:
    while var == 1 :
        item = q.get()
        Writewatt(item)
        q.task_done()

except KeyboardInterrupt:
    GPIO.cleanup()
GPIO.cleanup()           # clean up GPIO on normal exit  

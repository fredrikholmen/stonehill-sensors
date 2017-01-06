# stonehill-sensors
Sensor script to update a MySQL database with timeseries data

## Setup

```
sudo pm2 start outdoor.js --enabled
sudo pm2 start saveBlinks.py --enabled
sudo pm2 start temperature.js --enbabled
```

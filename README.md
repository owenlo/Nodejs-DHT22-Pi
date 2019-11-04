# Nodejs-dht22-sensor

Node.js express app for reading dht22 sensor running on Raspberry Pi 3 B+. 

The dht22 sensor is programmed to read the temperature (degrees celcius) and humidity every 15 minutes. Each reading is saved as a entry in a Sqlite3 database. The last reading can be viewed by making a GET request to the route: `/sensor`.

To setup sqlite3 on Raspberry Pi 3 B+, run the follow two commands (as originally described by https://github.com/mapbox/node-sqlite3/issues/933#issuecomment-389759765):

```
sudo apt-get install libsqlite3-dev
npm install sqlite3 --build-from-source --sqlite=/usr --save
```

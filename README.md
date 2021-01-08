# Nodejs-DHT22-Pi

Node.js express app for reading DHT22 sensor running on Raspberry Pi 3 B+. 

The DHT22 sensor is programmed to read the temperature (degrees celcius) and humidity every 15 minutes. Each reading is saved as a entry in a Sqlite3 database. A chart of temperature/humidity readings can be viewed by making a GET request to the route: `/`. This code assumes the data pin of the DHT22 is connected to GPIO 4 on the Raspberry Pi 3 B+. 

To setup sqlite3 on Raspberry Pi 3 B+, run the follow two commands (as originally described by https://github.com/mapbox/node-sqlite3/issues/933#issuecomment-389759765):

```
sudo apt-get install libsqlite3-dev
npm install sqlite3 --build-from-source --sqlite=/usr --save
```

An example of the chart produced by this project is shown below:

![example chart](https://github.com/owenlo/Nodejs-DHT22-Pi/blob/master/example_chart.png)

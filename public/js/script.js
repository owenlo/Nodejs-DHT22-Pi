$(document).ready(function() {

    //Source: https://stackoverflow.com/a/25275808
    function formatDate(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear() + " " + strTime;
    }

    //Source: https://stackoverflow.com/a/7220510
    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    $("#btnShowHideData").click(function() {
        if (document.getElementById('rawJsonData').style.visibility === "hidden") {
            document.getElementById('rawJsonData').style.visibility = "visible";
        } else {
            document.getElementById('rawJsonData').style.visibility = "hidden";
        }
      });

    var titleText = "DHT22 Temperature and Humidity <%- filtertype %> Reading";
    var ctx = document.getElementById('dhtChart').getContext('2d');

    parsedData = parseChartData(chartData);
    document.getElementById('rawJsonData').appendChild(document.createElement('pre')).innerHTML = syntaxHighlight(JSON.stringify(parsedData, undefined, 4));
    document.getElementById('rawJsonData').style.visibility = "hidden";

    var dhtChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: parsedData.datetime,
            datasets: [{
                label: 'Humidity %',
                yAxisID: "yHumid",
                data: parsedData.humidity,
                backgroundColor: [
                    'rgb(54, 162, 235)'
                ],
                borderColor: [
                    'rgb(54, 162, 235)'
                ],
                borderWidth: 5,
                fill: false
            }, {
                label: 'Temperature °C',
                yAxisID: "yTemp",
                data: parsedData.temperature,
                backgroundColor: [
                    'rgb(255, 99, 132)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)'
                ],
                type: 'line',
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                text: titleText
            },
            scales: {
                yAxes: [{
                    id: 'yHumid',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        max: 70,
                        min: 0
                    }
                }, {
                    id: 'yTemp',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        max: 30,
                        min: 0
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontSize: 12,
                        autoSkip: true,
                        maxTicksLimit: 20
                    }
                }]
            },
            plugins: {
                zoom: {
                    // Container for pan options
                    pan: {
                        // Boolean to enable panning
                        enabled: true,

                        // Panning directions. Remove the appropriate direction to disable 
                        // Eg. 'y' would only allow panning in the y direction
                        mode: 'xy'
                    },

                    // Container for zoom options
                    zoom: {
                        // Boolean to enable zooming
                        enabled: true,

                        // Zooming directions. Remove the appropriate direction to disable 
                        // Eg. 'y' would only allow zooming in the y direction
                        mode: 'xy',
                    }
                }
            }
        }
    });

    function parseChartData(chartData) {
        let datetimes = [];
        let humidities = [];
        let temperatures = [];

        for (i = 0; i < chartData.length; i++) {
            datetimes.push(formatDate(new Date(chartData[i].datetime)));
            humidities.push(chartData[i].humidity);
            temperatures.push(chartData[i].temperature);
        }

        return {
            datetime: datetimes,
            humidity: humidities,
            temperature: temperatures
        };
    }

});
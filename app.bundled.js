"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * BTCApp class monitors state
 */

var BTCApp = function () {
    function BTCApp(updateInterval, totalPoints, options) {
        _classCallCheck(this, BTCApp);

        this.updateInterval = updateInterval;
        this.totalPoints = totalPoints;
        this.data = [];
        this.dataset = [{ label: "USD/BTC", data: this.data, color: "#00FF00" }];
        this.options = options;
        this.count = 0;
        this.currentMax = 0;
        this.currentMin = Number.MAX_VALUE;
        this.historicalData = [];
        this.now = new Date();
    }

    _createClass(BTCApp, [{
        key: "setLiveEventListeners",
        value: function setLiveEventListeners() {
            $("#flot-placeholder1").bind("plothover", function (event, pos, item) {
                if (item) {
                    var x = getFormattedTime(item.datapoint[0]),
                        y = item.datapoint[1].toFixed(2);

                    $("#tooltipLive").html("Value at " + x + "<br><h3>$" + y + '</h3>').css("left", pos.pageX + 2 + 'px').css("top", pos.pageY + 2 + 'px').fadeIn(500);
                    // document.querySelector("#tooltipLive").left = pos.pageX + 'px';  
                    // console.log( 'left :' +document.querySelector("#tooltipLive").left)
                    // document.querySelector("#tooltipLive").top = pos.pageY + 'px';  
                } else {
                    $("#tooltipLive").hide();
                }
            });
        }
    }, {
        key: "updatePriceView",
        value: function updatePriceView(price) {
            $("#num").html('$<strong>' + price + '</strong>');
        }
    }, {
        key: "getDataFromAPI",
        value: function getDataFromAPI(currentTime) {
            var _this = this;

            var btcValues = void 0;
            $.ajax({
                type: "GET",
                url: "https://blockchain.info/ticker",
                data: {},
                success: function success(response) {

                    btcValues = response;
                },
                error: function error() {
                    //console.log('error');
                }
            }).done(function () {
                _this.updatePriceView(btcValues['USD']['last']);
                //updateNumber(btcValues['USD']['buy']);
                _this.pushToPlot([currentTime, btcValues['USD']['last']]);
            });
        }
    }, {
        key: "GetData",
        value: function GetData() {
            var now = new Date().getTime();
            this.now = now;
            this.getDataFromAPI(this.now += this.updateInterval);
        }
    }, {
        key: "updatePlotRange",
        value: function updatePlotRange(dataPoint) {
            if (dataPoint[1] > this.currentMax) {

                this.options.yaxis.max = dataPoint[1] + 10;
                this.currentMax = this.options.yaxis.max;
            } else if (dataPoint[1] < this.currentMin) {
                this.options.yaxis.min = dataPoint[1] - 10;
                this.currentMin = this.options.yaxis.min;
            }
        }
    }, {
        key: "pushToPlot",
        value: function pushToPlot(dataPoint) {
            var _this2 = this;

            this.data.push(dataPoint);
            this.count++;
            this.updatePlotRange(dataPoint);
            this.update();
            if (this.count > this.totalPoints) {
                this.data.shift();

                this.count = 0;
            }

            //setTimeout(getDataFromAPI(), updateInterval) executes the function and waits, then returns to setTimeout
            //Instead wait for time, then execute the anon function


            setTimeout(function () {
                _this2.getDataFromAPI(_this2.now += _this2.updateInterval);
            }, this.updateInterval);
        }
    }, {
        key: "update",
        value: function update() {
            $.plot($("#flot-placeholder1"), this.dataset, this.options);
        }
    }, {
        key: "initApp",
        value: function initApp() {
            this.setLiveEventListeners();
            drawHistoricalPlot();
            //getHistoricalData('1year');
            this.GetData();
        }
    }]);

    return BTCApp;
}();

$(document).ready(function () {
    var initUpdateInterval = 1000;
    var initTotalPoints = 50;
    var btcApp = new BTCApp(initUpdateInterval, initTotalPoints, getInitOptions());
    btcApp.initApp();
});

/**
 * UTILITY FUNCTIONS
 */
/**
 * Returns formatted time
 * @param {Time in milliseconds} v 
 */
function getFormattedTime(v) {
    var date = new Date(v);
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return hours + ":" + minutes + ":" + seconds;
}

function getInitOptions() {
    var options = {
        series: {
            lines: {
                show: true,
                lineWidth: 1.2,
                fill: false
            }
        },
        xaxis: {
            mode: "time",
            tickSize: [2, "second"],
            tickFormatter: function tickFormatter(v, axis) {
                var date = new Date(v);
                return "";
            },
            axisLabel: "Time",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            // axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 10
        },
        yaxis: {
            min: 0,
            max: 0,
            tickSize: 10,
            // tickFormatter: function (v, axis) {
            //     
            // },
            axisLabel: "USD/BTC",
            axisLabelUseCanvas: true,
            axisLabelFontSizePixels: 12,
            // axisLabelFontFamily: 'Verdana, Arial',
            axisLabelPadding: 6
        },
        legend: {
            labelBoxBorderColor: "#fff"
        },
        grid: {
            backgroundColor: "#000000",
            //tickColor: "#008040",
            hoverable: true,
            clickable: true
        }
    };
    return options;
}

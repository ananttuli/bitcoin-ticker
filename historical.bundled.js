'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/**
 * DRAW PLOT WITH HISTORICAL DATA
 */
var drawHistoricalPlot = function drawHistoricalPlot() {
    //-------CALLS--------
    var chartMin = void 0,
        chartMax = void 0;
    var historicalData = [];
    fetchHistoricalData('1year');
    setupHistoricalEventListeners();

    //----DEFINITIONS----------
    function setupHistoricalEventListeners() {
        $(function () {
            $("#timeDropdown").change(function () {
                var text = $('#timeDropdown option:selected').val();
                fetchHistoricalData(text);
            });
        });
    }
    function fetchHistoricalData(time) {
        var btcHistoricalValues = void 0;
        var start = void 0,
            end = void 0;

        // url (required), options (optional)
        //Date format yyyy-mm-day

        //JavaScript fetch API
        var _buildDateParams = buildDateParams(time);

        var _buildDateParams2 = _slicedToArray(_buildDateParams, 2);

        start = _buildDateParams2[0];
        end = _buildDateParams2[1];
        fetch('https://api.coindesk.com/v1/bpi/historical/close.json?start=' + start + '&end=' + end, {
            method: 'get'
        }).then(function (response) {
            return response.json();
        }).then(function (data) {

            plotHistoricalData(data);
        });
    }

    function plotHistoricalData(data) {
        historicalData = [];
        storeResult(data);

        var _calculateHistoricalL = calculateHistoricalLimits(historicalData);

        var _calculateHistoricalL2 = _slicedToArray(_calculateHistoricalL, 2);

        chartMin = _calculateHistoricalL2[0];
        chartMax = _calculateHistoricalL2[1];

        $(function () {

            var dataset;
            dataset = [{ label: "USD/BTC", data: historicalData, color: "#00FF00" }];

            $.plot("#historicalPlot", dataset, getInitHistoricalOptions());

            $("#historicalPlot").bind("plothover", function (event, pos, item) {
                if (item) {
                    var x = item.datapoint[0],
                        y = item.datapoint[1].toFixed(2);
                    x = new Date(x);
                    var date = new Date(x);
                    x = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
                    $("#historicalTooltip").html(" Value on " + x + "<br><h3>$" + y + '</h3>').css("left", pos.pageX + 2 + 'px').css("top", pos.pageY + 2 + 'px').fadeIn(100);
                } else {
                    $("#historicalTooltip").hide();
                }
            });
        });
    }
    /**
     * UTILITY FUNCTIONS
     */

    function buildDateParams(time) {
        var today = new Date();
        var eDate, eYear, eMonth;
        var sDate, sYear, sMonth;
        var start, end;

        eYear = today.getFullYear();
        eMonth = today.getMonth() + 1;
        eDate = today.getDate();

        if (time == '1year') {
            sMonth = eMonth;
            sDate = eDate;
            sYear = eYear - 1;
        } else if (time == '6month') {
            sMonth = eMonth - 6 < 1 ? 12 - (eMonth - 6) : eMonth - 6;
            sDate = eDate;
            sYear = eMonth - 6 < 1 ? eYear - 1 : eYear;
        } else if (time == '3month') {
            sMonth = eMonth - 3 < 1 ? 12 - (eMonth - 3) : eMonth - 3;
            sDate = eDate;
            sYear = eMonth - 3 < 1 ? eYear - 1 : eYear;
        } else if (time == '1month') {
            sMonth = eMonth - 1 < 1 ? 12 - (eMonth - 1) : eMonth - 1;
            sDate = eDate;
            sYear = eMonth - 1 < 1 ? eYear - 1 : eYear;
        }

        sMonth = sMonth < 10 ? '0' + sMonth : sMonth;
        eMonth = eMonth < 10 ? '0' + eMonth : eMonth;

        sDate = sDate < 10 ? '0' + sDate : sDate;
        eDate = eDate < 10 ? '0' + eDate : eDate;

        start = sYear;
        end = eYear;
        end += '-' + eMonth + '-' + eDate;
        start += '-' + sMonth + '-' + sDate;
        eDate = today.getDate();

        if (time == '1year') {
            sMonth = eMonth;
            sDate = eDate;
            sYear = eYear - 1;
        } else if (time == '6month') {
            sMonth = eMonth - 6 < 1 ? 12 - (eMonth - 6) : eMonth - 6;
            sDate = eDate;
            sYear = eMonth - 6 < 1 ? eYear - 1 : eYear;
        } else if (time == '3month') {
            sMonth = eMonth - 3 < 1 ? 12 - (eMonth - 3) : eMonth - 3;
            sDate = eDate;
            sYear = eMonth - 3 < 1 ? eYear - 1 : eYear;
        } else if (time == '1month') {
            sMonth = eMonth - 1 < 1 ? 12 - (eMonth - 1) : eMonth - 1;
            sDate = eDate;
            sYear = eMonth - 1 < 1 ? eYear - 1 : eYear;
        }

        sMonth = sMonth < 10 ? '0' + sMonth : sMonth;
        eMonth = eMonth < 10 ? '0' + eMonth : eMonth;

        sDate = sDate < 10 ? '0' + sDate : sDate;
        eDate = eDate < 10 ? '0' + eDate : eDate;

        start = sYear;
        end = eYear;
        end += '-' + eMonth + '-' + eDate;
        start += '-' + sMonth + '-' + sDate;
        return [start, end];
    }

    function calculateHistoricalLimits(data) {
        var max = 0,
            min = Number.MAX_VALUE;
        for (var i = 0; i < data.length; i++) {

            if (data[i][1] > max) {
                max = data[i][1];
            }
            if (data[i][1] < min) {
                min = data[i][1];
            }
        }
        return [min, max];
    }

    function storeResult(data) {
        for (var k in data.bpi) {
            var fldate = k.split('-');
            var yr = parseInt(fldate[0]);
            var mnth = parseInt(fldate[1]);
            var dt = parseInt(fldate[2]);

            var newDate = new Date(yr, mnth - 1, dt, 0, 0, 0, 0);

            historicalData.push([newDate, data.bpi[k]]);
        }
    }

    function getInitHistoricalOptions() {
        var historicalOptions = {
            series: {
                lines: {
                    show: true,
                    fill: true
                },
                points: {
                    show: false
                }
            },
            grid: {
                hoverable: true,
                clickable: true
            },
            xaxis: {
                mode: "time",
                tickSize: [1, "day"],
                tickColor: "#FFFFFF",
                tickFormatter: function tickFormatter(v, axis) {
                    return "";
                },
                axisLabel: "Time",

                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12
                // axisLabelFontFamily: 'Verdana, Arial',
                //axisLabelPadding: 10
            },
            yaxis: {
                min: chartMin + 30,
                max: chartMax - 30,
                axisLabelUseCanvas: true,
                tickColor: "#FFFFFF"
            }

        };

        return historicalOptions;
    }
};

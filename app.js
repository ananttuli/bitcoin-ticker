




function getFormattedTime(v){
        date = new Date(v);
            var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

        return hours + ":" + minutes + ":" + seconds;
}


$(document).ready(function () {
    getHistoricalData('1year');
    $(function(){
        $("#timeDropdown").change(function(){
            var text = $('#timeDropdown option:selected').val();
            getHistoricalDataTime(text);
    });
    });
    
    var data = [];
    var dataset;
    var totalPoints = 50;
    var updateInterval = 1000;
    var now = new Date().getTime();
    var count = 0;
    var currentMax = 0;
    var currentMin = 9999;

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
            tickFormatter: function (v, axis) {
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

    $("#flot-placeholder1").bind("plothover", function (event, pos, item) {
                        if (item) {
                            var x = getFormattedTime(item.datapoint[0]),
                                y = item.datapoint[1].toFixed(2);
                            $("#tooltipLive").html("Value at " + x + "<br><h3>$" + y+'</h3>')
                                
                                .fadeIn(500);
                        } else {
                            $("#tooltipLive").hide();
                        }
                    
                });


function updateNumber(num){
   
    $("#num").html('$<strong>'+num+'</strong>');
}

    function getDataFromAPI(currentTime) {
        let btcValues;
        $.ajax({
            type: "GET",
            url: "https://blockchain.info/ticker",
            data: {},
            success: function (response) {
    
                btcValues = response;
                
            },
            error: function () {
                //console.log('error');
            }
        }).done(function () {
            
            updateNumber(btcValues['USD']['buy']);
            pushToPlot([currentTime, btcValues['USD']['buy']]);
        });
    
    }
    

    
    
    
    function pushToPlot(dataPoint){
        data.push(dataPoint);
        count++;
        if(dataPoint[1] > currentMax){
           
            options.yaxis.max = dataPoint[1]+10;
            currentMax = options.yaxis.max;
        }else if(dataPoint[1] < currentMin){
            options.yaxis.min = dataPoint[1] - 10;
            currentMin = options.yaxis.min;
        }
        
        
        update();
        if(count > totalPoints){
            data.shift();
            
            count = 0;
        }

        //setTimeout(getDataFromAPI(), updateInterval) executes the function and waits, then returns to setTimeout
        //Instead wait for time, then execute the anon function
        setTimeout(function() { getDataFromAPI(now+=updateInterval); },updateInterval);
        
    
    }
    function GetData() {
        data.shift();
    

    getDataFromAPI(now+=updateInterval);
        
    }
    

    GetData();

    dataset = [
        { label: "USD/BTC", data: data, color: "#00FF00" }
    ];

    $.plot($("#flot-placeholder1"), dataset, options);

    function update() {
        $.plot($("#flot-placeholder1"), dataset, options);
    }

    
});
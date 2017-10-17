var historicalData = [];

function getHistoricalData(){
    //API ENDPOINT https://api.blockchain.info/charts/market-price?timespan=1year&rollingAverage=8hours&format=json&sampled=true
    let btcHistoricalValues;
    var today = new Date();
    var todayYear = today.getFullYear();
    
    var todayMonth = today.getMonth();
    todayMonth+=1;
    if(todayMonth < 10) todayMonth = '0'+todayMonth;
    var todayDate = today.getDate();
    if(todayDate < 10) todayDate = '0'+todayDate;

    start = (todayYear - 1);
    end = todayYear;
    end += '-'+todayMonth+'-'+todayDate;
    start += '-'+todayMonth+'-'+todayDate;


            // url (required), options (optional)
            //Date format yyyy-mm-day
        fetch('https://api.coindesk.com/v1/bpi/historical/close.json?start='+start+ '&end='+end, {
            method: 'get'
        }).then(function(response) { return response.json(); })
        .then(function(data) {


          plotHistoricalData(data);
        });
    

}

function getHistoricalDataTime(time){
    let btcHistoricalValues;
    var today = new Date();
    var eDate, eYear, eMonth;
    var sDate, sYear, sMonth;
console.log('time:'+time);

    eYear = today.getFullYear();
    eMonth = today.getMonth() + 1;
    eDate = today.getDate();

    if(time == '1year'){
        sMonth = eMonth;
        sDate = eDate;
        sYear = eYear -1;
    }else if(time == '6month'){
        sMonth = (eMonth-6)<1?12-(eMonth-6):eMonth-6;
        sDate = eDate;
        sYear = (eMonth-6)<1?eYear -1:eYear;
    }else if(time == '3month'){
        sMonth = (eMonth-3)<1?12-(eMonth-3):eMonth-3;
        sDate = eDate;
        sYear = (eMonth-3)<1?eYear -1:eYear;
    }else if(time == '1month'){
        sMonth = (eMonth-1)<1?12-(eMonth-1):eMonth-1;
        sDate = eDate;
        sYear = (eMonth-1)<1?eYear -1:eYear;
    }


    sMonth = (sMonth < 10)?'0'+sMonth:sMonth;
    eMonth = (eMonth < 10)?'0'+eMonth:eMonth;

    sDate = (sDate < 10)?'0'+sDate:sDate;
    eDate = (eDate < 10)?'0'+eDate:eDate;
    


    start = sYear;
    end = eYear;
    end += '-'+eMonth+'-'+eDate;
    start += '-'+sMonth+'-'+sDate;
console.log('start:'+sYear);
console.log('end:'+end);

            // url (required), options (optional)
            //Date format yyyy-mm-day
        fetch('https://api.coindesk.com/v1/bpi/historical/close.json?start='+start+ '&end='+end, {
            method: 'get'
        }).then(function(response) { return response.json(); })
        .then(function(data) {


          plotHistoricalData(data);
        });
    
}

function calculateMaximum(data){
    let max = 0;
    for(let i = 0; i < data.length; i++){

        if(data[i][1] > max){
            max = data[i][1];
        }
    }
    return max;
}

function calculateMinimum(data){
    let min = 9999999;
    for(let i = 0; i < data.length; i++){
        if(data[i][1] < min){
            min = data[i][1];
        }
    }
    return min;
}

function plotHistoricalData(data){
    historicalData = [];
    for(var k in data.bpi){
        var fldate = k.split('-');
        var yr = parseInt(fldate[0]);
        var mnth = parseInt(fldate[1]);
        var dt = parseInt(fldate[2]);
        
        var newDate = new Date(yr,mnth-1,dt,0,0,0,0);
        
        historicalData.push([newDate,data.bpi[k]]);
    }

    var chartMin = calculateMinimum(historicalData);
    var chartMax = calculateMaximum(historicalData);
    console.log(historicalData);
	$(function() {

                var dataset;
                    dataset = [
                        { label: "USD/BTC", data: historicalData, color: "#00FF00" }
                    ];
                    //console.log(dataset);

                var historicalOptions = {
                        series: {
                            lines: {
                                show: true,
                                fill:true
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
                            tickColor:"#FFFFFF",
                            tickFormatter: function (v, axis) {
                                // //console.log('v'+v);
                                // var date = new Date(v);
                                // //console.log('baad ki date'+date);
                                
    
                                //     return date.getDate()+'/'+date.getMonth()+'/'+date.getFullYear();
                                return "";
                            },
                            axisLabel: "Time",
                            
                            axisLabelUseCanvas: true,
                            axisLabelFontSizePixels: 12,
                            // axisLabelFontFamily: 'Verdana, Arial',
                            //axisLabelPadding: 10
                        },
                        yaxis: {
                            min: chartMin+30,
                            max: chartMax-30,
                            axisLabelUseCanvas:true,
                            tickColor:"#FFFFFF"
                        }
                        
                    };
                   
                 $.plot("#historicalPlot",dataset, historicalOptions);
        
               
        
                $("#historicalPlot").bind("plothover", function (event, pos, item) {
                        if (item) {
                            var x = item.datapoint[0],
                                y = item.datapoint[1].toFixed(2);
                           x = new Date(x);
                           var date = new Date(x);
                           x = date.getDate() + '/'+date.getMonth()+'/'+date.getFullYear();
                            $("#historicalTooltip").html(item.series.label + " Value on " + x + "<br><h3>$" + y+'</h3>')
                                
                                .fadeIn(500);
                        } else {
                            $("#historicalTooltip").hide();
                        }
        
                });
        
                $("#placeholder").bind("plotclick", function (event, pos, item) {
                    if (item) {
                        $("#clickdata").text(" - click point " + item.dataIndex + " in " + item.series.label);
                        plot.highlight(item.series, item.datapoint);
                    }
                });
        
                // Add the Flot version string to the footer
        
                $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
            });
        
}
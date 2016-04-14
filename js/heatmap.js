var Heatmap = {
	chart: {
        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 40
        },


        title: {
            text: this.title
        },

        xAxis: {
            categories: this.labelX,
            allowDecimals:false,
            min:0,
            max:36,
            tickInterval:1,
        },

        yAxis: {
            categories: this.labelY,
            title: null,
            allowDecimals:false,
            min:0,
            max:36,
             tickInterval:1,

        },

        colorAxis: {
            min: 0,
            max:1,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[8]
        },

        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 10,
            symbolHeight: 320
        },

        tooltip: {
            formatter: function () {
            	var conference = $("#dataconferencia").val();
  				var year = $("#conferenceYear").val();
                return '<b> base: DBLP </b><br> <b>Conference: ' + conference 
                + '</b><br><b>Ano: '+year+'</b><br><b> Node[ '+this.point.y+', '+this.point.x
                +']:' +
                     this.point.value+ '</b>';
            }
        },

        series: []
    },
    title:"",
    labelY:[],
    labelX:[],
    parse:function( obj ){
    	var conference = $("#dataconferencia").val();
  		var year = $("#conferenceYear").val();
    	this.title = "Teste";
    	for(i=1;i<=37;i++){
    		this.labelX.push(i);
    		this.labelY.push(i);
    	}

    	var objectName = year;
  		if(year == "ALL"){
  			objectName = conference;
  		}
  		var arrayData = [];
  		for( i in cosseno[0][objectName]){
  			for(j in cosseno[0][objectName][i]["cos"]){
  				var cos  = +(cosseno[0][objectName][i]["cos"][j].toFixed(4));
  				arrayData.push([+(i),+(j),cos]);
  			}  				
		}


    	var series = [{
            name: 'Cossine value',
            borderWidth: 1,
            data: arrayData,
            dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                    textShadow: 'none'
                }
            }
        }];
    	this.chart.series = series;

    	return this.chart;

    }

};



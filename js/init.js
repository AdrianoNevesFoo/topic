var cosseno=[];	
$(document).ready(function(){

	$.ajax({
		url:"data/conf.json",
		success:function(data){
			var conf = data;
			$("#database").html('<option value="-1">Choose a database</option>');
			for( i in conf){
				$("#database").append('<option value="'+conf[i].database.toLowerCase()+'">'+conf[i].database+'</option>')
			}
			$("#database").change(function(){
				var index = $("#database").val();	
				console.log( "DATABASE: "+index);
				if( index == -1 ) return false;
				for( var i in conf){
					if( index == conf[i].database.toLowerCase()){
						$("#dataconferencia").html('<option value="-1">Choose an conference</option>');
						for( var j in conf[i].conference){
							$("#dataconferencia").append('<option value="'+j.toLowerCase()+'">'+j+'</option>');
						}	
						$("#dataconferencia").change(function(){
							var confName = $("#dataconferencia").val().toUpperCase();								
							$("#conferenceYear").html('<option value="-1">Choose an year</option>');
							
							for(var k in conf[i].conference[confName]){
								$("#conferenceYear").append('<option value="'+conf[i].conference[confName][k]+'">'+conf[i].conference[confName][k]+'</option>');
							}


							$("#topicTitle").html(confName.toUpperCase());

							$("#conferenceYear").change(function(){
								var year = $("#conferenceYear").val();
								console.log("Ano: "+year);

								if(year != -1){
									if( cosseno.length == 0){

										$.ajax({

											url:"data/dblp/cossine/"+$("#dataconferencia").val()+"_Cossine.json",
											success:function(data){										
												// console.log("Ano: "+year);
												Tree.tree1 = -1;
												Tree.tree2 = -1;
												cosseno = data;

												$('#container').css("height", "900px");
												$('#container').highcharts(Heatmap.parse(cosseno));
												
												Tree.init("HAN", index, 'han');
												Tree.init("MYTREE",index, confName);
											}, 
											error:function(data){
												cosseno = JSON.parse(data.responseText);
												Tree.init("HAN", index, 'han');
												Tree.init("MYTREE",index, confName);
											}
										});
									}else{
										Tree.tree1 = -1;
										Tree.tree2 = -1;	
										Tree.init("HAN", index, 'han');
										Tree.init("MYTREE",index, confName);
									}
								}

							});


						});
					}
				}
			});
		}, 
		error:function(data){
			cosseno = JSON.parse(data.responseText);
			Tree.init("HAN");
			Tree.init("MYTREE");
		}
	});
	
	
	
});

var Tree ={
	click:[],
	topic:[],
	treeid:[],
	tree1:-1,
	tree2:-1,
	init:function( type, index, conference ){
		switch( type ){
			case "HAN":
			var self = this;
				$.ajax({
					url:"data/"+index.toLowerCase()+"/"+conference.toLowerCase()+".json",					
					success:function(data){
						var han = data;						
						self.parse( han, "han_tree" ) ;
					}, 
					error:function(data){
						var han = JSON.parse(data.responseText);
						self.parse( han, "han_tree" ) ;
					}
				});
				break;
			case "MYTREE":
				var self = this;
				$.ajax({
					url:"data/"+index.toLowerCase()+"/"+conference.toLowerCase()+".json",					
					success:function(data){
						var conferenceTree = data;
						self.parseConferenceTree( conferenceTree, "my_tree" ) ;
					}, 
					error:function(data){					
						var conferenceTree = JSON.parse(data.responseText);
						self.parseConferenceTree( conferenceTree, "my_tree" ) ;
					}
				});
				break;
		}
	},
	parse:function( json, selector ){
		var elements = [];
		var edges = [];
		for(i in json ){
			var obj = {
				data:{
					id: json[i].id,
					topic: json[i].topic

				}
			};
			elements.push( obj );
			if( json[i].target.length>0){
				for(j in json[i].target){
					var edge = {
						data:{
							id:"o"+json[i].id+"t"+json[i].target[j],
							source: json[i].id,
							target: json[i].target[j]
						}
					};
					edges.push( edge);
				}
			}
		}

		
		var narr =[];
		for( i in elements ){
			narr.push( elements[i]);
		}
		for( i in edges ){
			narr.push( edges[i]);
		}

		var tree = cytoscape({
			container: document.getElementById(selector),
			elements: narr,
			boxSelectionEnabled: false,
          	autounselectify: true,
			style: [
						{
							selector: 'node',
							style: {
								'content': 'data(id)',
								'color':'#000',
								'text-opacity': 0.5,
								'text-valign': 'center',
								'text-halign': 'right',
								'background-color': '#11479e'
							}
						},

						{
							selector: 'edge',
							style: {
								'width': 4,
								'target-arrow-shape': 'triangle',
								'line-color': '#9dbaea',
								'target-arrow-color': '#9dbaea'
							}
						}
					],

		  layout: {
		    name: 'dagre',
		  },
		  ready: function(){
		    window.tree = this;
		  },
		  

		});
		for( i in elements ){
			var html = elements[i].data.topic;

			tree.nodes().on("tap", function(evt){
				var tree_id = $( evt.cy.container() ).attr("id") ;
				// $("#"+tree_id+"_details").html(this.data('topic'));

			  	if( Tree.click.length > 0 && Tree.click.length <2 ){
			  		var checked = false;
			  		for(i in Tree.click){
			  			if( Tree.click[i] == this.data('id') ) {
			  				if( Tree.treeid[i] == tree_id)
			  					checked = true;
			  			}
			  		}
			  		if( !checked){
			  			tree.$("#"+this.data('id')).style('background-color',"#DFF80B");
			  			Tree.click.push( this.data('id') );
			  			Tree.topic.push( this.data('topic') );
			  			Tree.treeid.push( tree_id );
			  			//console.log( "Tamanho: "+Tree.click.length);
			  			//console.log( Tree.click);
			  		}
			  	} else if(Tree.click.length == 0){
			  		tree.$("#"+this.data('id')).style('background-color',"#DFF80B");	
			  		Tree.click.push( this.data('id') );
			  		Tree.topic.push( this.data('topic') );
			  		Tree.treeid.push( tree_id );
			  		//console.log( "Tamanho: "+Tree.click.length);
			  		//console.log( Tree.click);
			  	}

			  	

			});
		}
		if( Tree.tree1 == -1 ) Tree.tree1 = tree;
		else if( Tree.tree2 == -1 ) Tree.tree2 = tree;
		
	},

		parseConferenceTree:function( json, selector ){
		var elements = [];
		var edges = [];
		var year = $("#conferenceYear").val();
		var jsonYear = json[0][year];
		
		for(i in jsonYear){
			var obj = {
				data:{
					id: jsonYear[i]["id"],
					topic: jsonYear[i]["topic"]

				}
			};
			elements.push( obj );
			if( jsonYear[i]["target"].length>0){
				for(j in jsonYear[i]["target"]){
					var edge = {
						data:{
							id:"o"+jsonYear[i]["id"]+"t"+jsonYear[i]["target"][j],
							source: jsonYear[i]["id"],
							target: jsonYear[i]["target"][j]
						}
					};
					edges.push( edge);
				}
			}
		}
		
		var narr =[];
		for( i in elements ){
			narr.push( elements[i]);
		}
		for( i in edges ){
			narr.push( edges[i]);
		}

		var tree = cytoscape({
			container: document.getElementById(selector),
			elements: narr,
			boxSelectionEnabled: false,
          	autounselectify: true,
			style: [
						{
							selector: 'node',
							style: {
								'content': 'data(id)',
								'color':'#000',
								'text-opacity': 0.5,
								'text-valign': 'center',
								'text-halign': 'right',
								'background-color': '#11479e'
							}
						},

						{
							selector: 'edge',
							style: {
								'width': 4,
								'target-arrow-shape': 'triangle',
								'line-color': '#9dbaea',
								'target-arrow-color': '#9dbaea'
							}
						}
					],

		  layout: {
		    name: 'dagre',
		  },
		  ready: function(){
		    window.tree = this;
		  },
		  

		});
		for( i in elements ){
			var html = elements[i].data.topic;

			tree.nodes().on("tap", function(evt){
				var tree_id = $( evt.cy.container() ).attr("id") ;

			  	if( Tree.click.length > 0 && Tree.click.length <2 ){
			  		var checked = false;
			  		for(i in Tree.click){
			  			if( Tree.click[i] == this.data('id') ) {
			  				if( Tree.treeid[i] == tree_id)
			  					checked = true;
			  			}
			  		}
			  		if( !checked){
			  			tree.$("#"+this.data('id')).style('background-color',"#DFF80B");
			  			Tree.click.push( this.data('id') );
			  			Tree.topic.push( this.data('topic') );
			  			Tree.treeid.push( tree_id );
			  		}
			  	} else if(Tree.click.length == 0){
			  		tree.$("#"+this.data('id')).style('background-color',"#DFF80B");	
			  		Tree.click.push( this.data('id') );
			  		Tree.topic.push( this.data('topic') );
			  		Tree.treeid.push( tree_id );
			  	}

			  	

			});
		}
		if( Tree.tree1 == -1 ) Tree.tree1 = tree;
		else if( Tree.tree2 == -1 ) Tree.tree2 = tree;
		
	},
}
var interval = window.setInterval( function(){
	if( Tree.click.length == 2 ){

		var conference = $("#dataconferencia").val();
  		var year = $("#conferenceYear").val();
  		var cossineJSON = "data/dblp/cossine/"+conference+"_Cossine.json";


  		var arrTopic1 = Tree.topic[0].split(",");
  		var arrTopic2 = Tree.topic[1].split(",");

  		var topicDiffer1 = Tree.topic[0].split(/(?:,| )+/);
  		var topicDiffer2 = Tree.topic[1].split(/(?:,| )+/);


  		var qtdTopicarrTopic1 = arrTopic1.length; 
  		var qtdTopicarrTopic2 = arrTopic2.length;

  		var qtdTopicosDiferentes = 0;
   		for( i in arrTopic2 ){
  			if( arrTopic1.indexOf( arrTopic2[i]) == -1){
  				arrTopic2[i] = '<span class="differ">'+arrTopic2[i]+'</span>';
  				qtdTopicosDiferentes = qtdTopicosDiferentes+1;
  			}else{
  				console.log(arrTopic1.indexOf( arrTopic2[i]));
  				arrTopic1[arrTopic1.indexOf( arrTopic2[i])] = '<span class="equals">'+'<strong>'+arrTopic1[arrTopic1.indexOf( arrTopic2[i])]+'</strong>'+'</span>';
  			}
  		}
  		
  		arrTopic2 = arrTopic2.join(","); 
  		// $("#myModal").find("#han_topic").html('<h4>'+"Topic ID: "+Tree.click[0]+'</h4>'+"<br />"+Tree.topic[0]+"<br /><br /> Quantidade de topicos: "+qtdTopicarrTopic1);  		
  		// $("#myModal").find("#my_topic").html('<h4>'+"Topic ID: "+Tree.click[1]+'</h4>'+"<br />"+arrTopic2+"<br /><br /> Quantidade de topicos: "+qtdTopicarrTopic2+"<br/>Quantidade de topicos diferentes: "+qtdTopicosDiferentes);

  		$("#han_tree_details").html('<h4>'+"Topic ID: "+Tree.click[0]+'</h4>'+"<br />"+arrTopic1+"<br /><br /> Quantidade de topicos: "+qtdTopicarrTopic1);
  		$("#my_tree_details").html('<h4>'+"Topic ID: "+Tree.click[1]+'</h4>'+"<br />"+arrTopic2+"<br /><br /> Quantidade de topicos: "+qtdTopicarrTopic2+"<br/>Quantidade de topicos diferentes: "+qtdTopicosDiferentes);
  		


  		var qtdTopicosTotalDiferentes = 0;
  		for(i in topicDiffer2){
  			if( topicDiffer1.indexOf( topicDiffer2[i]) == -1){
  				topicDiffer2[i] = '<span class="totaldiffer">'+topicDiffer2[i]+'</span>';
  				qtdTopicosTotalDiferentes = qtdTopicosTotalDiferentes+1;
  			}
  		}
  		topicDiffer2 = topicDiffer2.join(", ");
  		// $("#myModal").find("#my_term").html('<h4>'+"Topic ID: "+Tree.click[1]+'</h4>'+"<br />"+topicDiffer2+"<br /><br /> Quantidade de topicos: "+qtdTopicarrTopic2+"<br/>Quantidade de topicos Totalmente diferentes: "+qtdTopicosTotalDiferentes);



  		var objectName = year;
  		if(year == "ALL"){
  			objectName = conference;
  		}
  		
		var hanID = Tree.click[0];
		var myID = Tree.click[1];
		for( i in cosseno[0][objectName] ){
			if(i == hanID){  
				$("#cosineValue").attr("value", cosseno[0][objectName][i].cos[myID]);
				// $("#myModal").find("#cosseno").html(cosseno[0][objectName][i].cos[myID]+"  ");				
			}
			
		}  	   		 
  		
  		// $("#myModal").modal();
  		Tree.topic=[];
  		Tree.click=[];
  		Tree.tree1.nodes().forEach(function( ele ){
  			ele.style('background-color', '#11479e');
  		});
  		Tree.tree2.nodes().forEach(function( ele ){
  			ele.style('background-color', '#11479e');
  		});
  	}

}, 300);
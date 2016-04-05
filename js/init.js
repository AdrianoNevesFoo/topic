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
			/*tree.$('#'+elements[i].data.id).qtip({
			  content: 'Topics:<br> '+html+"",
			  position: {
			    my: 'top center',
			    at: 'bottom center'
			  },
			  style: {
			    classes: 'myCustomClass',
			    width:800,
			    tip: {
			      width: 16,
			      height: 8
			    }
			  }
			});	*/

			tree.nodes().on("tap", function(evt){
				var tree_id = $( evt.cy.container() ).attr("id") ;
				$("#"+tree_id+"_details").html(this.data('topic'));

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
		console.log("--->"+$("#dataconferencia").val()+"    "+$("#conferenceYear").val());
		var jsonYear = json[0][year];
		
		for(i in jsonYear){
			// console.log(jsonYear[i]["target"]);
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
			/*tree.$('#'+elements[i].data.id).qtip({
			  content: 'Topics:<br> '+html+"",
			  position: {
			    my: 'top center',
			    at: 'bottom center'
			  },
			  style: {
			    classes: 'myCustomClass',
			    width:800,
			    tip: {
			      width: 16,
			      height: 8
			    }
			  }
			});	*/

			tree.nodes().on("tap", function(evt){
				var tree_id = $( evt.cy.container() ).attr("id") ;
				$("#"+tree_id+"_details").html(this.data('topic'));

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
}
var interval = window.setInterval( function(){
	if( Tree.click.length == 2 ){

		var conference = $("#dataconferencia").val();
  		var year = $("#conferenceYear").val();
  		//var cossineJSON = "data/dblp/cossine/"+conference+"_Cossine.json";
  		console.log(cosseno[0]["2007"]);

  		console.log( "id"+Tree.click[0]+": "+Tree.topic[0]);
  		console.log( "id"+Tree.click[1]+": "+Tree.topic[1]);

  		var arrTopic1 = Tree.topic[0].split(",");
  		var arrTopic2 = Tree.topic[1].split(",");



  		// var join1 = arrTopic1.join(" ");
  		// var join2 = arrTopic2.join(" ");

  		// var totalmenteDiferente1 = join1.split(" ");
  		// var totalmenteDiferente2 = join2.split(" ");
		
		// console.log(totalmenteDiferente1);
  // 		console.log(totalmenteDiferente2);

  		// for(i in totalmenteDiferente2){
  		// 	if( totalmenteDiferente1.indexOf( totalmenteDiferente2[i]) == -1){
  		// 		totalmenteDiferente2[i] = '<span class="differ">'+totalmenteDiferente2[i]+'</span>';
  		// 	}
  		// }
  		var qtdTopicarrTopic1 = 0; 
  		for(i in arrTopic1){
  			qtdTopicarrTopic1 = qtdTopicarrTopic1+1;
  		}

  		var qtdTopicarrTopic2 = 0;
   		for( i in arrTopic2 ){
   			qtdTopicarrTopic2 = qtdTopicarrTopic2+1;
  			if( arrTopic1.indexOf( arrTopic2[i]) == -1){
  				arrTopic2[i] = '<span class="differ">'+arrTopic2[i]+'</span>';
  			}
  		}
  		console.log("topic1: "+qtdTopicarrTopic1+"   topic2: "+qtdTopicarrTopic2);

  		arrTopic2 = arrTopic2.join(","); 

  		// totalmenteDiferente2 = totalmenteDiferente2.join(",")
  		console.log($("myModal").find("h3"));
  		qtdTopicarrTopic1 = qtdTopicarrTopic1-1;
  		qtdTopicarrTopic2 = qtdTopicarrTopic2-1;
  		$("#myModal").find("#han_topic").html('<h4>'+"Topic ID: "+Tree.click[0]+'</h4>'+"<br />"+Tree.topic[0]+"<br /><br /> Quantidade de topicos: "+qtdTopicarrTopic1);
  		
  		$("#myModal").find("#my_topic").html('<h4>'+"Topic ID: "+Tree.click[1]+'</h4>'+"<br />"+arrTopic2+"<br /><br /> Quantidade de topicos: "+qtdTopicarrTopic2);

  		if(year == "ALL"){
  			var hanID = Tree.click[0];
  			var myID = Tree.click[1];
  			for( i in cosseno[0][conference] ){
  				if(i == hanID){  		
  					$("#myModal").find("#cosseno").html(cosseno[0][conference][i].cos[myID]+"  ");
  					
  				}
  				
  			}  	   		 
  		}
  		// $("#myModal").find("#cosseno").html(cossineJSON);
  		$("#myModal").modal();
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
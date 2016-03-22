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
				for( i in conf){
					if( index == conf[i].database.toLowerCase()){
						$("#dataconferencia").html('<option value="-1">Choose an conference</option>');
						for( j in conf[i].conference){
							$("#dataconferencia").append('<option value="'+conf[i].conference[j].toLowerCase()+'">'+conf[i].conference[j]+'</option>');
						}
						$("#dataconferencia").change(function(){
							var conference = $("#dataconferencia").val();
							if( cosseno.length == 0){
								$.ajax({
									url:"data/cos.json",
									success:function(data){
										cosseno = data;
										Tree.init("HAN", index, 'han');
										Tree.init("MYTREE",index, conference);
									}, 
									error:function(data){
										cosseno = JSON.parse(data.responseText);
										Tree.init("HAN", index, 'han');
										Tree.init("MYTREE",index, conference);
									}
								});
							}else{
								Tree.init("HAN", index, 'han');
								Tree.init("MYTREE",index, conference);
							}
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
						var han = data;
						self.parse( han, "my_tree" ) ;
					}, 
					error:function(data){
						var han = JSON.parse(data.responseText);
						self.parse( han, "my_tree" ) ;
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
			  			console.log( "Tamanho: "+Tree.click.length);
			  			console.log( Tree.click);
			  		}
			  	} else if(Tree.click.length == 0){
			  		tree.$("#"+this.data('id')).style('background-color',"#DFF80B");	
			  		Tree.click.push( this.data('id') );
			  		Tree.topic.push( this.data('topic') );
			  		Tree.treeid.push( tree_id );
			  		console.log( "Tamanho: "+Tree.click.length);
			  		console.log( Tree.click);
			  	}

			  	

			});
		}
		if( Tree.tree1 == -1 ) Tree.tree1 = tree;
		else if( Tree.tree2 == -1 ) Tree.tree2 = tree;
		
	},
}
var interval = window.setInterval( function(){
	if( Tree.click.length == 2 ){
  		console.log( "id"+Tree.click[0]+": "+Tree.topic[0]);
  		console.log( "id"+Tree.click[1]+": "+Tree.topic[1]);

  		var arrTopic1 = Tree.topic[0].split(",");
  		var arrTopic2 = Tree.topic[1].split(",");
  		for( i in arrTopic2 ){
  			if( arrTopic1.indexOf( arrTopic2[i]) == -1){
  				arrTopic2[i] = '<span class="differ">'+arrTopic2[i]+'</span>';
  			}
  		}
  		arrTopic2 = arrTopic2.join(",");
  		$("#myModal").find("#han_topic").html(Tree.topic[0]);
  		$("#myModal").find("#my_topic").html(arrTopic2);
  		$("#myModal").find("#cosseno").html(cosseno[Tree.click[0]-1][Tree.click[1]-1]);
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
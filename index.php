<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8">
	<title>Hierarchical Topic Trees</title>
	<link rel="stylesheet" href="css/main.css">
	<script src="lib/jquery/jquery.min.js"></script>
	<script src="lib/cytoscapeJS/cytoscape.min.js"></script>
	<script src="lib/dagre.min.js"></script>
	<script src="lib/cytoscape-dagre.js"></script>
	<script src="lib/jquery.qtip.min.js"></script>
	<link href="css/jquery.qtip.min.css" rel="stylesheet" type="text/css" />
	<link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
	<link href="js/select2.css" rel="stylesheet"/>
	<script src="js/select2.js"></script>
	<script src="lib/cytoscape-qtip.js"></script>

	<script>
		$(document).ready(function() { 
			$("#database").select2(); 
			$("#dataconferencia").select2(); 
			$("#conferenceYear").select2(); 
		});
	</script>
</head>
<body>
	<div id="Hierarchy">
		<h1> Hierarchical Topic Trees </h1>
	</div>
	
	<div id="filtros">
		<label for="database">Database:</label>
		<select name="" id="database">
		</select>
		<label for="dataconferencia">Conference:</label>

		<select name="" id="dataconferencia">
		</select>


		<label for="conferenceYear">Year:</label>
		<select name="" id="conferenceYear">
		</select>
	</div>
	<div id="trees">
		<ul class="treelist">
			<li>
				<div class="panel panel-default">
				  <div class="panel-heading">
				    <h3 class="panel-title">Han Topic Tree - DBLP</h3>
				  </div>
				  <div class="panel-body">
				    <div id="han_tree"></div>
					<h3>Han Topic</h3>
					<div id="han_tree_details"></div>
				  </div>
				</div>
				
				
			</li>
			<li>

				<div class="panel panel-primary">
				  <div class="panel-heading">
				    <h3 id="topicTitle" class="panel-title">My Topic Tree</h3>
				  </div>
				  <div class="panel-body">
				    				<div id="my_tree"></div>
				<h3>My Topic</h3>
				<div id="my_tree_details"></div>
				  </div>
				</div>

			</li>	
		</ul>

	</div>
	<!-- Modal -->
	<div class="modal fade" id="myModal" tabindex="1" role="dialog" aria-labelledby="myModalLabel">
	  <div class="modal-dialog" role="document">
	    <div class="modal-content">
	      <div class="modal-header">
	        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	        <h4 class="modal-title" id="myModalLabel">Tree Comparation</h4>
	      </div>
	      <div class="modal-body">
	      	<h4 class="cosseno">
				Cossine: <span id="cosseno"></span>
			</h4>
	        <ul id="topic_comparation" class="treelist">
				<li>
					<h3>Han Topic Tree</h3>
					<div id="han_topic"></div>
					
				</li>
				<li>
					<h3>My Topic Tree</h3>
					<div id="my_topic"></div>

				</li>	
			</ul>
			
	      </div>	      
	    </div>
	  </div>
	</div>

	<script src="js/init.js"></script>
	<script src="lib/bootstrap.min.js"></script>
</body>
</html>
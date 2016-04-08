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
	<script src="https://code.highcharts.com/highcharts.js"></script>
	<script src="https://code.highcharts.com/modules/exporting.js"></script>
	<script src="http://code.highcharts.com/modules/heatmap.js"></script>
	<script src="js/heatmap.js"></script>

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

				  </div>
				</div>

			</li>	
		</ul>
	</div>

	<div class="container" id="features">
		<!-- <h2>MEasures</h2> -->
	  <form role="form">
	    <div class="form-group">
	      <div class="col-xs-2" id="cosine">
	        <label for="ex1">cosine</label>
	        <strong> <input class="form-control" id="cosineValue" type="text" readonly> </strong>
	      </div>

	      <div class="col-xs-2" id="jaccard">
	        <label for="ex1">jaccard</label>
	        <input class="form-control" id="jaccardValue" type="text" readonly>
	      </div>

	      <div class="col-xs-2" id="entropy">
	        <label for="ex1">entropy</label>
	        <input class="form-control" id="entropyValue" type="text" readonly>
	      </div>
	    </div>
	  </form>
	</div>


	<div id="treeTopics">
		<ul class="treelist">
			<li>
			    <h3>Han Topic</h3>
			    <div id="han_tree_details"></div>					
			</li>
			<li>
				<h3>My Topic</h3>
				<div id="my_tree_details"></div>
			</li>	
		</ul>


	</div>	
		




	<!-- Modal -->
<!-- 	<div class="modal fade" id="myModal" tabindex="1" role="dialog" aria-labelledby="myModalLabel">
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
					
					<div>

					  <!-- Nav tabs -->
<!-- 					  <ul class="nav nav-tabs" role="tablist">
					    <li role="presentation" class="active"><a href="#different" aria-controls="different" role="tab" data-toggle="tab">Topic</a></li>
					    <li role="presentation"><a href="#completelyDifferent" aria-controls="completelyDifferent" role="tab" data-toggle="tab">Term</a></li>
					  </ul>

					  Tab panes
					  <div class="tab-content">
					    <div role="tabpanel" class="tab-pane fade in active" id="different"><div id="my_topic"></div></div>
					    <div role="tabpanel" class="tab-pane fade" id="completelyDifferent"><div id="my_term"></div></div>
					  </div>

					</div>
				</li>	
			</ul>
			
	      </div>	      
	    </div>
	  </div>
	</div> --> 
	<div id="container" ></div>

	<script src="js/init.js"></script>
	<script src="lib/bootstrap.min.js"></script>
</body>
</html>
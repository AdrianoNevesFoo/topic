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

<?php 
$tabs = array( "k10", "k20", "k50", "k100" ); 

?>


<div>

  <!-- Nav tabs -->
  	<!-- <div id="tabs"> -->
		  <ul class="nav nav-tabs" role="tablist">
		  	<?php foreach($tabs as $k=>$v ) : 
		  		$varClass ="";
		  		if($v == "k10"){
		  			$varClass = "active";
		  		}else{
		  			$varClass = "tab_a";
		  		}
		  	?>
		    	<li id="list" role="presentation" class="<?php echo $varClass;?>"><a href="#<?php echo $v;?>" aria-controls="<?php echo $v;?>" role="tab" data-toggle="tab"><strong><?php echo $v;?></strong></a></li>
		    <?php endforeach;?>
		  </ul>

		  <!-- Tab panes -->
		  <div class="tab-content">
		  	<?php foreach($tabs as $k=>$v ) : ?>
		    <div role="tabpanel" class="tab-pane fade <?php echo ($k==0)?"in active":"";?>" id="<?php echo $v;?>">
		    	<div id="trees">
					<ul class="treelist">
						<li>
							<div class="panel panel-default">
							  <div class="panel-heading">
							    <h3 class="panel-title">CATHY Topic Tree</h3>
							  </div>
							  <div class="panel-body">
							    <div class="tabtreeclass" id="han_tree<?php echo $v;?>"></div>						    			
							  </div>
							</div>
							
							
						</li>
						<li>

							<div class="panel panel-primary">
							  <div class="panel-heading">
							    <h3 id="topicTitle" class="panel-title">Dynamic Cubing Topic Tree</h3>
							  </div>
							  <div class="panel-body">
							    <div class="tabtreeclass" id="my_tree<?php echo $v;?>"></div>

							  </div>
							</div>

						</li>	
					</ul>


					<ul class="entropyList" >
						<li>
							<div class="col-xs-2" id="entropyHAN">
					        	<label for="ex1">Entropy</label>
					        	<strong> <input class="form-control" id="entropyHanValue" type="text" readonly> </strong>
					     	 </div>
						</li>
						<li>
							<div class="col-xs-2" id="entropyDHC">
					        	<label for="ex1">Entropy</label>
					        	<strong> <input class="form-control" id="entropyDHCValue" type="text" readonly> </strong>
					     	</div>
						</li>
					</ul>

				<div id ="results">
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
					    </div>
					  </form>
				</div>


					<div id="treeTopics">
						<ul class="treelist">
							<li>
							    <h3>CATHY Topics</h3>
							    <div id="han_tree_details"></div>					
							</li>
							<li>
								<h3>Dynamic Topics</h3>
								<div id="my_tree_details"></div>
							</li>	
						</ul>
					</div>	

						<div id="heatmap" ></div>
				</div>

			</div>
		    <?php endforeach;?>
		   
		  </div>
	<!-- </div> -->

</div>






	<!-- Modal - ->
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
					
					<div>				  

					</div>
				</li>	
			</ul>
			
	      </div>	      
	    </div>
	  </div>
	</div-->  
	
			
		
	
	<script src="js/init.js"></script>
	<script src="lib/bootstrap.min.js"></script>
</body>
</html>
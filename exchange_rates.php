<?php header('Access-Control-Allow-Origin: *'); # nescessary to make this thing working without a complaining browser
	
	$exchange_rates = array(
		array('init'=> 'eur', 'target'=> 'usd', 'rate'=> 1.2341),
		array('init'=> 'eur', 'target'=> 'chf', 'rate'=> 1.1580),
		array('init'=> 'eur', 'target'=> 'gbp', 'rate'=> 0.8906),
		array('init'=> 'usd', 'target'=> 'jpy', 'rate'=> 109.5290),
		array('init'=> 'chf', 'target'=> 'usd', 'rate'=> 1.0657),
		array('init'=> 'gbp', 'target'=> 'cad', 'rate'=> 1.7374)
	);

	$result = array(
		'exchange_rates' => $exchange_rates
	);

	echo json_encode($result); 
?>
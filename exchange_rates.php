<?php header('Access-Control-Allow-Origin: *'); # nescessary to make this thing working without a complaining browser
	
	$exchange_rates = array(
		array('init'=> 'eur', 'target'=> 'usd', 'rate'=> 1.2341),
		array('init'=> 'eur', 'target'=> 'chf', 'rate'=> 1.1580),
		array('init'=> 'eur', 'target'=> 'gbp', 'rate'=> 0.8906),
		array('init'=> 'usd', 'target'=> 'jpy', 'rate'=> 109.5290),
		array('init'=> 'chf', 'target'=> 'usd', 'rate'=> 1.0657),
		array('init'=> 'gbp', 'target'=> 'cad', 'rate'=> 1.7374)
	);

	$counter = 0;
	if (isset($_GET['counter'])) {
		$counter = (int)$_GET['counter'];

		if ($counter > 1) {
			# simulate changing a random exchange rate
			$number_of_exchange_rates = sizeof($exchange_rates);
			$random_rate = rand(0,$number_of_exchange_rates-1);
			$random_value = rand(0,1000)/1000;
			$exchange_rates[$random_rate]['rate'] += $random_value; 
		}
	}

	$action = '';
	if (isset($_GET['action'])) {
		$action = $_GET['action'];

		if ($action == 'update') {
			$eur_to_jpy = array('init'=> 'eur', 'target'=> 'jpy', 'rate'=> 131.8533);
			$eur_to_cad = array('init'=> 'eur', 'target'=> 'cad', 'rate'=> 1.5581);
			array_push($exchange_rates, $eur_to_jpy);
			array_push($exchange_rates, $eur_to_cad);
		}
	}

	$result = array(
		'exchange_rates' => $exchange_rates
	);

	echo json_encode($result); 
?>
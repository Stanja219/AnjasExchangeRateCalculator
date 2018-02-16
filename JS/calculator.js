(function() {
	var exchange_rates = [ 
		{'init': 'eur', 'target': 'usd', 'rate': 1.2341}, 
		{'init': 'eur', 'target': 'chf', 'rate': 1.1580},
		{'init': 'eur', 'target': 'gbp', 'rate': 0.8906},
		{'init': 'usd', 'target': 'jpy', 'rate': 109.5290},
		{'init': 'chf', 'target': 'usd', 'rate': 1.0657},
		{'init': 'gbp', 'target': 'cad', 'rate': 1.7374}
	];
	
	var field_value = document.getElementById("value"); 
	var field_init_currency = document.getElementById("init_currency");
	var field_target_currency = document.getElementById("target_currency");
	var text_result = document.getElementById("result");
	var text_errors = document.getElementById("errorhints");
	
	var chosen_value = field_value.value;
	var chosen_init_currency = field_init_currency.value;
	var chosen_target_currency = field_target_currency.value;
	
	// Event Listeners
	field_value.addEventListener("change", renderResult);
	field_init_currency.addEventListener("change", renderResult);
	field_target_currency.addEventListener("change", renderResult);
	
	
	function renderResult() {
				
		text_result.textContent = '';
		text_errors.textContent = '';
		
		get_field_values();

		if (!validateFields()) {
			text_errors.textContent = 'Bitte füllen Sie alle Felder aus';
		}
		else {
			if (chosen_init_currency === chosen_target_currency) {
				text_errors.textContent = 'Wählen Sie bitte 2 verschiedene Währungen aus.'
			} 
			else {
				var exchange_rate = find_exchange_rate();
				if (exchange_rate) {
					text_result.textContent = calculate_result(exchange_rate)
				} 
				else {
					text_errors.textContent = 'Für diese Konstellation liegen uns aktuell keine Werte vor.'
				}
			}
		}
	}
	
	function get_field_values() {
		// update field values
		chosen_value = field_value.value;
		chosen_init_currency = field_init_currency.value;
		chosen_target_currency = field_target_currency.value;
	}
	
	function validateFields(){
		// validate required fields
		var is_valid_number = false;
		if (chosen_value > 0 && !isNaN(chosen_value)) {
			is_valid_number = true;
		}
		
		var is_init_currency_chosen = false;
		if (chosen_init_currency !== '-1') {
			is_init_currency_chosen = true;
		}
		
		var is_target_currency_chosen = false;
		if (chosen_target_currency !== '-1') {
			is_target_currency_chosen = true;
		}
		
		var allFieldsAreValid = false;
		if (is_valid_number && is_init_currency_chosen && is_target_currency_chosen ) {
			allFieldsAreValid = true;		
		} 
			
		return allFieldsAreValid;
	}
	
	
	function find_exchange_rate() {
		// find matching exchange rate
		for (var exchange_rate of exchange_rates) {
			if (exchange_rate.init === chosen_init_currency && exchange_rate.target === chosen_target_currency ) {
				return exchange_rate;
			}
		}
	}
		
	function calculate_result(exchange_rate) {
		var t_product = chosen_value * exchange_rate.rate
		return t_product.toFixed(2) + ' ' + exchange_rate.target.toUpperCase();;
	}
	
  

})();
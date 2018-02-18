(function() {
	var exchange_rate_counter = 0;
	var exchange_rates = [ 
		{'init': 'eur', 'target': 'usd', 'rate': 1.2341}, 
		{'init': 'eur', 'target': 'chf', 'rate': 1.1580},
		{'init': 'eur', 'target': 'gbp', 'rate': 0.8906},
		{'init': 'usd', 'target': 'jpy', 'rate': 109.5290},
		{'init': 'chf', 'target': 'usd', 'rate': 1.0657},
		{'init': 'gbp', 'target': 'cad', 'rate': 1.7374}
	];

	var currency_names = {
		'cad': 'Kanadischer Dollar',
		'chf': 'Schweizer Franken',
		'eur': 'Euro',
		'gbp': 'Britisch Pfund',
		'jpy': 'Japanischer Jen',
		'usd': 'US Dollar'
	}
	
	var field_value = document.getElementById("value"); 
	var field_init_currency = document.getElementById("init_currency");
	var field_target_currency = document.getElementById("target_currency");
	var text_errors = document.getElementById("errorhints");
	var table_exchange_rates = document.getElementById("exchange_rates");
	var tbody_result = document.getElementById("result");
	var button_update_exchange_rates =  document.getElementById("update_exchange_rates");
	
	var chosen_value = field_value.value;
	var chosen_init_currency = field_init_currency.value;
	var chosen_target_currency = field_target_currency.value;
	
	// Event Listeners
	field_value.addEventListener("change", renderResult);
	field_init_currency.addEventListener("change", renderResult);
	field_target_currency.addEventListener("change", renderResult);
	button_update_exchange_rates.addEventListener("click", update_exchange_rates);
	
	//init
	get_exchange_rates();

	function render_init_currencies() {
		render_currency_options('init', field_init_currency);
	}

	function render_target_currencies() {
		render_currency_options('target', field_target_currency);
	}

	function render_currency_options(currency_type, select_field) {
		// Append options to dropdowns depending on the availiable exchange rates
		select_field.innerHTML = '<option value="-1">bitte wählen</option>';
		
		var currencies = [];
		for (var exchange_rate of exchange_rates) {
			if (currency_type == 'init') {
				if (currencies.indexOf(exchange_rate.init) === -1){
					currencies.push(exchange_rate.init);
				}
			}
			else if (currency_type == 'target') {
				if (currencies.indexOf(exchange_rate.target) === -1){
					currencies.push(exchange_rate.target);
				}
			}
		}
		for (var currency of currencies) {
			var option = '<option value="' + currency + '">' + currency_names[currency]+ ' (' + currency.toLocaleUpperCase() + ')</option>'
			select_field.insertAdjacentHTML(
				'beforeend',
				option
			);
		}
	}

	function get_exchange_rates(action) {
		// fetch exchange rates from an extern "source"
		exchange_rate_counter++;
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var response = JSON.parse(this.responseText);
				exchange_rates = response.exchange_rates;
				render_exchange_rates();
				render_init_currencies();
				render_target_currencies();
			}
		};
		var url = 'http://localhost/AnjaStrack/exchange_rate_calculator/exchange_rates.php?counter=' + exchange_rate_counter;
		if (action === 'update') {
			url = url + '&action=' + action;
		}

		xhttp.open("GET", url, true);
		xhttp.send();
	}

	function update_exchange_rates() {
		get_exchange_rates('update');
	}

	function render_exchange_rates() {
		table_exchange_rates.innerHTML = '';
		for (var exchange_rate of exchange_rates) {
			render_table_row(
				table_exchange_rates, 
				1, 
				exchange_rate.init,
				exchange_rate.target,
				exchange_rate.rate
			)
		}
	}

	function render_table_row(table, value, init, target, result) {
		var cell_init = '<td><div class="flag_'+ init + '"></div></td><td>' + value + ' '+ init.toLocaleUpperCase()+'</td><td>&#8596;</td>';
		var cell_target = '<td class="text-right">'+ result + ' ' + target.toLocaleUpperCase()+'</td><td><div class="flag_'+ target +'"></div></td>';
		var row = '<tr>'+cell_init + cell_target + '</tr>';
		table.insertAdjacentHTML(
			'beforeend',
			row
		);
	}

	function renderResult() {
				
		tbody_result.innerHTML = '';
		tbody_result.parentNode.classList.add("hidden");
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
					render_table_row(
						tbody_result, 
						chosen_value, 
						exchange_rate.init,
						exchange_rate.target,
						calculate_result(exchange_rate)
					);
					tbody_result.parentNode.classList.remove("hidden");
				} 
				else {
					text_errors.textContent = 'Für diese Konstellation liegen uns aktuell keine Werte vor.'
				}
			}
		}
		
		if (text_errors.textContent) {
			text_errors.classList.remove("hidden");
		} 
		else {
			text_errors.classList.add("hidden");
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
		return t_product.toFixed(2);
	}
	
	
  
})();
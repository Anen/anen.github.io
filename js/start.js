function clickHandler(link_text) {
	console.log("Calling ClickHandler()...");

									  // Date
  	var currentdate = new Date(); 
	var datetime = currentdate.getDate() + "/"
                	+ (currentdate.getMonth()+1)  + "/" 
                	+ currentdate.getFullYear() + " @ "  
                	+ currentdate.getHours() + ":"  
                	+ currentdate.getMinutes() + ":" 
                	+ currentdate.getSeconds();
    
    							     // Click count    
	if (localStorage.getItem("clickcount") == null) {
  		localStorage.clickcount = 1;
  	} else {
    	localStorage.clickcount = Number(localStorage.clickcount) + 1;
  	}        
        	                           	           
                	           // MAJ history
  	localStorage.history = datetime
  								  + " (" + localStorage.clickcount + ") " 
  								  + link_text;
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  	var sels = document.getElementsByTagName('a');
  	for(i = 0; i < sels.length; i++) {
		sels[i].addEventListener('click', 
							     function(){ clickHandler(this.innerText); } );
  	}
});    
 
window.onload = function() {  
	console.log("Calling OnLoad()...");
	//localStorage.clear();
	document.getElementById("History").innerHTML = localStorage.history;

	// Load weather widget
	!function(d, s, id){
		var js,fjs = d.getElementsByTagName(s)[0];
		if(!d.getElementById(id)){
			js = d.createElement(s);
			js.id = id;
			js.src = 'https://weatherwidget.io/js/widget.min.js';
			fjs.parentNode.insertBefore(js,fjs);
		}
	}(document,'script','weatherwidget-io-js');
	
	// Load fractal dailies
	var xhr1 = new XMLHttpRequest();
	xhr1.onreadystatechange = function() {
		if (xhr1.readyState != 4 || xhr1.status != 200) 
			return;
				
		var data1 = JSON.parse(xhr1.responseText);		
		var achievIds = [];
		data1.fractals.forEach(function (arrayItem) {
			achievIds.push(arrayItem.id);
		});

		// Get details of achiev.		
		var xhr2 = new XMLHttpRequest();
		xhr2.onreadystatechange = function() {
			if (xhr2.readyState != 4 || xhr2.status != 200) 
				return;

			var data2 = JSON.parse(xhr2.responseText);
			var fractalDetails = [];
			var recFractals = [];
			data2.forEach(function (arrayItem) {
				if (arrayItem.name.includes('Recommended')) {
					var recLevel = arrayItem.name.match(/\d+/)[0];
					recFractals.push(recLevel);
				} else {
					var detail = arrayItem.name.replace('Daily Tier 1 ', '');
					detail = detail.replace('Daily Tier 2 ', '');
					detail = detail.replace('Daily Tier 3 ', '');
					detail = detail.replace('Daily Tier 4 ', '');
					fractalDetails.push(detail);
				}			
			});

			var UniqResetFractals = [...new Set(fractalDetails)];
			document.getElementById("ResetFractals").innerHTML += UniqResetFractals.join(' - ') + ' - (' + recFractals.join(', ') + ')';	
		};

		xhr2.open("GET", "https://api.guildwars2.com/v2/achievements?lang=en&&ids=" + achievIds.join(), true);
		xhr2.send();	
	};

	xhr1.open("GET", "https://api.guildwars2.com/v2/achievements/daily/tomorrow", true);
	xhr1.send();
};


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
	new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
	  	xhr.onreadystatechange = (e) => {
			if (xhr.readyState !== 4) {
		  		return;
			}
  
			if (xhr.status === 200) {
		  		resolve(JSON.parse(xhr.responseText));
			} else {
		  		console.warn('request_error ' + xhr.status);
			}
	  	};
  
	  	xhr.open("GET", "https://api.guildwars2.com/v2/achievements/daily/tomorrow");
	  	xhr.send();
	}).then(function(result) { 
		var achievIdArr = [];
		result.fractals.forEach(function (arrayItem) {
			achievIdArr.push(arrayItem.id);
		});

		new Promise(function (resolve, reject) {
			var xhr2 = new XMLHttpRequest();
			xhr2.onreadystatechange = (e) => {
				if (xhr2.readyState !== 4) {
					return;
				}
	
				if (xhr2.status === 200) {
					resolve(JSON.parse(xhr2.responseText));
				} else {
					console.warn('request_error ' + xhr2.status);
				}
			};
	
			xhr2.open("GET", "https://api.guildwars2.com/v2/achievements?lang=en&&ids=" + achievIdArr.join(), true);
			xhr2.send();
		}).then(function(result2) { 
			var dailyArr = [];
			var recsArr = [];
			result2.forEach(function (arrayItem) {
				if (arrayItem.name.includes('Recommended')) {
					var recLevel = arrayItem.name.match(/\d+/)[0];
					recsArr.push(recLevel);
				} else {
					var detail = arrayItem.name.replace('Daily Tier 1 ', '');
					detail = detail.replace('Daily Tier 2 ', '');
					detail = detail.replace('Daily Tier 3 ', '');
					detail = detail.replace('Daily Tier 4 ', '');
					dailyArr.push(detail);
				}			
			});

			// Removes duplicates from T1, T2, T3, and T4.
			var dailySet = [...new Set(dailyArr)];

			document.getElementById("ResetFractals").innerHTML += dailySet.join(' - ') + ' - (' + recsArr.join(', ') + ')'; 
		}); // then(function(result2)
	}); // then(function(result)
}; // window.onload

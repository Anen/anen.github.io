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
	
}; // window.onload

var ppt = 0;// pips per tick
var currentChest = 0;

var user = {// NOTE: this object (which is saved to localStorage) is shared with mutiple pages
	pipRank: 0
};
var localStorageName = "wvwtracker";

function calcPPT() {
	ppt = 0;

	if ($("#commitment").is(':checked')) {
		ppt += 1;
	}
	if ($("#commander").is(':checked')) {
		ppt += 1;
	}
	if ($("#public_commander").is(':checked')) {
		ppt += 3;
	}

	// rank calculate (1 for first, then +1 for each additional)
	ppt += 1 + $("option[name=rank]").index($("option[name=rank]:selected"));

	// placement calculate (boxes are worth 1st=5,2nd=4,3rd=3)
	ppt += 6 - $("input:radio[name=placement]").index($("input:radio[name=placement]:checked"));
}

function display() {
	var out = "<div><div>Pips Per Tick:</div><div><b>" + ppt + "</b></div></div>";

	$("#out").html(out);
}

function loadRank() {
	if (localStorage.getItem(localStorageName)) {
		try {
			user = JSON.parse(localStorage.getItem(localStorageName));

			// if we have an existing rank saved, check the correct radio
			if(user.pipRank){
				$("option[name=rank]:eq(" + user.pipRank + ")").prop("selected", true);
			}

		} catch (e) {
			console.log("Error loading/parsing JSON '" + localStorageName + "' stored in localStorage", e)
		}
	}
}

function saveRank() {
	user.pipRank = $("option[name=rank]").index($("option[name=rank]:selected")),

	localStorage.setItem(localStorageName, JSON.stringify(user));
}

function refreshTable(){
	var allZ1 = $("td[name=z1]");

	var pipsEarned = 0;
	var ticketsEarned = 0; 
	var cumulPipsFromChest= 0;

	for(i=0; i <= allZ1.length; i++) {

		pipsEarned += parseInt($(allZ1[i]).attr('data-pips'));
		ticketsEarned += parseInt($(allZ1[i]).attr('data-tickets'));

		var out = "";

		if (i < currentChest) {
			out += "~h~~m";
			$(allZ1[i]).attr('class','table-dark');
		} else {
			cumulPipsFromChest += parseInt($(allZ1[i]).attr('data-pips'));
			var ticksRemaining = Math.ceil(cumulPipsFromChest / ppt);
			out += Math.floor(ticksRemaining / 12) + "h" + ((ticksRemaining % 12) * 5) + "m";
			$(allZ1[i]).attr('class','');
		}

		out += "</br><small>" + ticketsEarned + "/365 (" + Math.round(ticketsEarned / 365 * 100) + "%)</small>";
		out += "</br><small>" + pipsEarned + "/1450 (" + Math.round(pipsEarned / 1450 * 100) + "%)</small>";

		$(allZ1[i]).html(out);
	}
}

window.onload = function() {  
	console.log("Calling OnLoad()...");
	(function($) {

		$.fn.pipCalc = function() {
			$(this).on("change", "input", function(e) {
				calcPPT();
				display();
				saveRank();
				refreshTable();
			});

			$(this).on("change", "select", function(e) {
				calcPPT();
				display();
				saveRank();
				refreshTable();
			});

			$("td[name=z1]").click(function(){
				currentChest = $("td[name=z1]").index(this);
				refreshTable();
			});

			// calculate on load
			loadRank();
			calcPPT();
			display();
			refreshTable();
		};

	}(jQuery));

	$("#pips").pipCalc();
}; // window.onload
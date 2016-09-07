function CountDown(){
	if (document.getElementById) {
		Maintenant = new Date;
		TempMaintenant = Maintenant.getTime();
		Future = new Date(2014, 5, 12);
		TempFuture = Future.getTime();
		DinaHeure = Math.floor((TempFuture-TempMaintenant)/1000);
		DinaHeure = "" + DinaHeure;
		if (DinaHeure <= 0)
			DinaHeure = "0";
		document.getElementById("countdown").innerHTML=DinaHeure;
	}
	temporebour = setTimeout("CountDown()", 1000)	
}

window.onload = CountDown;
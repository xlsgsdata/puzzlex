var table = document.getElementById("puz");
var scoresTbl = document.getElementById("scores");
var rows;
var lockPuzzle = 'False';
var arr_rows = [];
var arr_cols = [];	
var entries = [];

// sounds ------------------------------------------------------------------------------------------------
let addXsound = new Audio("sounds/addX.wav");
addXsound.volume = 0.2;
let removeXsound = new Audio("sounds/removeX.wav");
removeXsound.volume = 0.1;
let completedsound = new Audio("sounds/completed.wav");
completedsound.volume = 0.2;
let scoreaddedsound = new Audio("sounds/scoreadded.wav");
scoreaddedsound.volume = 0.1;

//Timer function -----------------------------------------------------------------------------------------
var timerVariable;
var totalSeconds = 0;

function countUpTimer() {
  ++totalSeconds;
  var hour = Math.floor(totalSeconds / 3600);
  var minute = Math.floor((totalSeconds - hour * 3600) / 60);
  var seconds = totalSeconds - (hour * 3600 + minute * 60);
  document.getElementById("timer").innerText = pad(minute) + ":" + pad(seconds);
}
   
function pad ( value ) { return value > 9 ? value : "0" + value; }

function stopTimer() {
	clearInterval(timerVariable);
}

// navigation -------------------------------------------------------------------------------------------
function getPage() {
	var p = window.location.pathname;
	if (p.match('/contact')) {
		var navi = "contact";	
	} else if (p.match('/about')) {
		var navi = "about";
	} else {
		var navi = "play";	
	}
	naviSelect(navi);
}

function naviSelect(navi) {
	document.getElementById(navi).style.borderBottom = "2px solid #662d91";
	document.getElementById(navi).style.fontWeight = "bold"; 	
}

//create grid  ------------------------------------------------------------------------------------------
	function createGrid(){	
		const params = new URLSearchParams(document.location.search);
		rows = params.get("x");
		if (rows == null) { rows = "10"; }
		let cols = rows;			
		var w = 50;
		
		getPage();
		document.getElementById(rows).style.backgroundColor = "#800080";  //highlight selected level
		document.getElementById(rows).style.color = "white";  //highlight selected level
		
		//create table
		for (var r = 0; r < rows; r++){    
			var row = table.insertRow(table.rows.length);
			for (var c = 0; c < cols; c++){
				var cell = row.insertCell(c);
				cell.onclick = function () {
					addX(this);
				};
			}
		}
		
		//adjust table height and font size
		w = table.rows[0].cells[0].offsetWidth;	
		var xsize;
		if ( rows < 18 ) { 
			xsize = (w - (24 - rows)); 
		} else { 
			xsize = (w - 6); 
		}
			
		for (var r = 0; r < rows; r++){   			
			document.getElementsByTagName("tr")[r].style.height = w + "px";			
			document.getElementsByTagName("tr")[r].style.fontSize = xsize + "px";		
		}
		addAllXs(rows,cols);			
	}
	
	
	function addAllXs(rows,cols) {
		var cell;
		var r;
		var c;
		var i = 0;
		do {
			r = Math.floor(Math.random() * rows);  //randon row
			c = Math.floor(Math.random() * cols);  //randon col
			cell = table.rows[r].cells[c]
			if (arr_rows[r]==undefined && arr_cols[c]==undefined && cell.innerText=="") {
				arr_rows[r] = 1;
				arr_cols[c] = 1;
				cell.innerText="X";
				i++;
			}
		}
		while (i < rows);
		//debugsolution();
		removeXs(rows,cols);
	}
	
	function debugsolution() {  //just to see the puzzle solutoin in console
		var cell = "";
		for (var r = 0; r < rows; r++){    
			var line = "";
			for (var c = 0; c < rows; c++){    
				cell = table.rows[r].cells[c]
				if (cell.innerText=="") {
					line = line + "0";
				} else {
					line = line + cell.innerText;
				}
			}
			console.log(line);
		}
	}
	
	function removeXs(rows,cols) {
		var cell;
		var r;
		var c;
		var i = 0;
		do {
			r = Math.floor(Math.random() * rows);  //randon row
			c = Math.floor(Math.random() * cols);  //randon col
			cell = table.rows[r].cells[c]
			if (cell.innerText=="X") {
				arr_rows[r] = 0;
				arr_cols[c] = 0;
				cell.innerText="";
				add0s(r,c,i);
				i++;
			}
		}
		while (i < rows);
		timerVariable = setInterval(countUpTimer, 1000);
	}
	
	function add0s(r, c, i) {
		//if (i % 2 == 0) {  // is this really needed?????????????????????
		//	for (var ro = 0; ro < rows; ro++){    //adds to rows
		//			cell = table.rows[ro].cells[c];
		//			if (arr_rows[ro]==0 && ro!=r) {
		//				cell.style.backgroundColor = "black";
		//			}
		//	}
		//} else {
			for (var co = 0; co < rows; co++){  //add to columns		
				cell = table.rows[r].cells[co];
					if (arr_cols[co]==0 && co!=c) {
						cell.style.backgroundColor = "#333333";
						cell.onclick = "";
					}
			}	
		//}
	}
	
	//player adds X  -----------------------------------------------------------------------------------------------------------
	function addX(tableCell) {
		if (lockPuzzle == 'False') {
			var cellValue = tableCell.innerText;
			let r = tableCell.parentNode.rowIndex;
			let c = tableCell.cellIndex;
			if (cellValue == "") {
				addXsound.play();			
				tableCell.innerText = "X";
				//tableCell.innerHTML = '<img src="x.png" style="display:block; margin:auto;" width="90%" height="90%"></img>';
				//tableCell.innerHTML = '<p style="display:block; margin:auto;" width="100%" height="100%">X</p>';
				//tableCell.style.backgroundColor = "blue";
				checkaddX(r,c);			
			} else if (cellValue == "X") {
				removeXsound.play();			
				tableCell.innerText = "";
				checkremoveX(r,c);
			}
		}
	}
	
	function checkaddX(ro,co) {
		var rcell;
		var ccell;
		var xrcount = 0;
		var xccount = 0;
		for (var i = 0; i < rows; i++) {    
			ccell = table.rows[i].cells[co];
			rcell = table.rows[ro].cells[i];			
			if (i!==ro && ccell.innerText == "X") {
				xccount++;
				table.rows[ro].cells[co].style.color = "red";
				for (var r = 0; r < rows; r++){   
					table.rows[r].cells[co].style.opacity = 0.75;		
				}
			}
			if (i!==co && rcell.innerText == "X") {
				xrcount++;
				table.rows[ro].cells[co].style.color = "red";
				table.rows[ro].style.opacity = 0.75;				
			}
		}
		checkComplete();	
	}
	
	function checkremoveX(ro,co) {
		var rcell;
		var ccell;
		var rowConflict = false;
		var colConflict = false;
		var xrcount = 0;
		var xccount = 0;
		
			for (var r = 0; r < rows; r++) {    			
				ccell = table.rows[r].cells[co];
				if (xccount < 2) {
					if (ccell.innerText == "X") {
						xccount++;
						for (var c = 0; c < rows; c++) {  
							if (c!=co && table.rows[r].cells[c].innerText == "X") {
								colConflict = true;
								break;
							}
						}						
					}
				} else {
					break;
				}
			}
			if (xccount < 2) {
				for (var r = 0; r < rows; r++) {  				
					table.rows[r].cells[co].style.opacity = 1;					
				}
			}
			
			if (xccount < 2 && colConflict == false) {
				for (var r = 0; r < rows; r++) {   
					table.rows[r].cells[co].style.color = "purple";				
					//for (const child of table.rows[ro].children) {  //other way to do it with child property
						//child.style.color = "purple";
						//child.style.opacity = 1;
					//}							
				}
			}
			
			for (var c = 0; c < rows; c++) {    			
				rcell = table.rows[ro].cells[c];
				if (xrcount < 2) {
					if (rcell.innerText == "X") {
						xrcount++;
						for (var r = 0; r < rows; r++) {  
							if (r!=ro && table.rows[r].cells[c].innerText == "X") {
								rowConflict = true;
								break;
							}
						}						
					}
				} else {
					break;
				}
			}
			
			if (xrcount < 2 ) {
				table.rows[ro].style.opacity = 1;	
			}
			
			if (xrcount < 2 && rowConflict == false) {							
				for (const child of table.rows[ro].children) {  //other way to do it with child property
					child.style.color = "purple";
				}						
			}	

		checkComplete();
	}
	
	
	//confirm puzzle is solved  --------------------------------------------------------------------------------
	function checkComplete() {
		var cell;
		var xcount = 0;
		for (var r = 0; r < rows; r++){    
			for (var c = 0; c < rows; c++){    
				cell = table.rows[r].cells[c];
				if (cell.innerText == "X" && cell.style.color != "red") { 
					xcount++;
				} else if (cell.innerText == "X" && cell.style.color == "red") {
					xcount--;
				}
			}
		}

		if (xcount == rows) {
			stopTimer();
			lockPuzzle = 'True';			
			document.getElementById("timer").style.fontWeight = 'bold';		
			document.querySelectorAll('.topright').forEach( div => {
				//div.style.border = "1px solid purple";
				div.style.animation = "pulse 1s infinite";	
			});
			completedsound.play();			
			getScores();  //get data for scores table
			//setTimeout(saveScore, 1000);
		}
	}
	
	function saveScore() {
		let time = document.getElementById("timer").innerText;
		let name = prompt("Good job! Completion time: " + time + "  Enter your name or alias here:");	
		if (name != null) {
			if (name != "") {
				scoreaddedsound.play();	
				entries.push([name,time]);
				addRowToTable();
				showScores(name,time);
				writeScore (name,time).then(response => {
					console.log(response);  //no response, just add score in sheets
				})
			} else {
				//alert("You didn't add any name. Scroll down to see the top scores.");
			}
		} else {
			//alert("Scroll down to see the top scores.");
		}
		//document.getElementById("again").innerText = 'PLAY AGAIN';	//NOT needed??????????????????	
	}
	
	//scores table  ----------------------------------------------------------------------------------------------
	function addScoresTable() {
		var pos = 0;
		if (entries.length > 0) {
			for (var r = 0; r < entries.length; r++){    
				pos++;			
			addRowToTable();
			scoresTbl.rows[r].cells[0].innerText = pos;
			}
		}
	}	
	
	function addRowToTable() {
		var row = scoresTbl.insertRow(scoresTbl.rows.length);		
		for (var c = 0; c <= 2; c++){
			var cell = row.insertCell(c);
			cell.innerText = scoresTbl.rows.length; 
				if (c==1) {
					cell.width = "70%";						
				} else if (c==0) { 
					cell.width = "15%";										
				}
		}
	}
	
	function showScores(name,time) {
		var scoresTbl = document.getElementById("scores");
		if (entries.length > 0) {	
			document.getElementById("scores_msg").innerText = "";		
			let sorted = entries.sort((a, b) => { return a[1].localeCompare(b[1]); });		
			for (var i = entries.length - 1; i >= 0; i--){    
				scoresTbl.rows[i].cells[1].innerText = sorted[i][0];
				scoresTbl.rows[i].cells[2].innerText = sorted[i][1];			
				if (name!=null && scoresTbl.rows[i].cells[1].innerText == name && scoresTbl.rows[i].cells[2].innerText == time) {
					scoresTbl.rows[i].style.backgroundColor = "#800080";
					scoresTbl.rows[i].style.color = "white";
					scoresTbl.rows[i].scrollIntoView();
					break;
				}	
			}
		} else {
			document.getElementById("scores_msg").innerText = "Be the first to save your score!";
		}	
	}
	
	//get scores / add score ------------------------------------------------------------------------------------------
	async function getData () {
		const token = "1234";
		const sheet = rows + "X";		
		const url = "https://script.google.com/macros/s/AKfycbxJIUvd2RvsBw5MDV7FLx1ARVK6-r2gUvimAJLsQ5ddmob5Jgx3xuBhCoSHSTTqrgdQ/exec"
		+ "?token=" + token + "&sheet=" + sheet;
	 	
		let response = await fetch(url)
		.then(response => response.text())
		return response;
	}
	
	async function writeScore (name,time) {
		const token = "1234";
		const sheet = rows + "X";		
		let data = sheet + "," +  name + "," + time;
			
		const url = "https://script.google.com/macros/s/AKfycbxJIUvd2RvsBw5MDV7FLx1ARVK6-r2gUvimAJLsQ5ddmob5Jgx3xuBhCoSHSTTqrgdQ/exec"
		+ "?token=" + token;
	 	
		let response = await fetch(url, {
			method: 'POST',
			mode: "no-cors",
			headers: {
				'Content-Type': 'text/plain'
			},
		body: data
		})
		.then(response => response.text())
		return response;
	}	
	
	function getScores() {
		getData().then(response => {
			if (response!='Failed') {
				entries = JSON.parse(response);
			}	
			document.getElementById("bottom").style.display = "flex";			
			addScoresTable();
			showScores(null);
			saveScore();
		})
	}
	

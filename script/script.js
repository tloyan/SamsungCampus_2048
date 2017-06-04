//window.onload = function() {
var grille = newGame();
if (getCookie("score") != "") {
	var score = parseInt(getCookie("score"));
} else {
	var score = 0;
}
var grilleTmp;
var grilleAnimate = [];
var lastAnim;
var countTouched;

function newGame(grille_size = 4) {
	if(getCookie("countTouched") != "") {
		countTouched = getCookie("countTouched") - 1;
	} else {
		countTouched = -1
	}
	document.getElementById("winLoose").innerHTML = "";
	if (getCookie("grille") == "") {
		var grille = new Array(grille_size);
		for (x = 0; x < grille_size; x++) {
			grille[x] = new Array(grille_size);
			for (y = 0; y < grille_size; y++) {
				grille[x][y] = 0;
			}
		}
		score = 0;
	} else {
		var grilleT = getCookie("grille").split(",");
		var grille = new Array(grille_size);
		var compteur = 0;
		for (x = 0; x < grille_size; x++) {
			grille[x] = new Array(grille_size);
			for (y = 0; y < grille_size; y++) {
				grille[x][y] = parseInt(grilleT[compteur++]);
			}
		}
	}	
	document.querySelectorAll(".grille_contenaire")[0].innerHTML = "";
	var indexT = 0;
	for(var u = 0; u < 16; u++) {
		var margL = ((u % 4) * 104.6)+4.6;
		
		if(margL == 4.6 && u != 0) {
			indexT += 1;
		}
		margT = (indexT * 104.6)+4.6;
		var iDiv = document.createElement('div');
		iDiv.className = 'grille_cellule';
		document.querySelectorAll(".grille_contenaire")[0].appendChild(iDiv);
		document.querySelectorAll(".grille_contenaire>div")[u].style.marginLeft = margL+"px";
		document.querySelectorAll(".grille_contenaire>div")[u].style.marginTop = margT+"px";
		if(u == 15) {
		var wait = setInterval(function() {
				 	clearInterval(wait);
				 	 if(getCookie("grille") == "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0") {
				 		randomCell(grille, grille_size);
						randomCell(grille, grille_size);	
				 	}
					displayGrille(grille_size, grille);
					return grille;			 	
		}, 200);
		}
	}
	var indexT = 0;
	for(var u = 0; u < 16; u++) {
		var margL = ((u % 4) * 104.6)+4.6;
		
		if(margL == 4.6 && u != 0) {
			indexT += 1;
		}
		margT = (indexT * 104.6)+4.6;
		var iDiv = document.createElement('div');
		iDiv.className = 'grille_cellule_hide';
		document.querySelectorAll(".grille_contenaire")[0].appendChild(iDiv);
		document.querySelectorAll(".grille_contenaire>.grille_cellule_hide")[u].style.marginLeft = margL+"px";
		document.querySelectorAll(".grille_contenaire>.grille_cellule_hide")[u].style.marginTop = margT+"px";
	}
	setCookie("grille", grille, 1);
	return grille;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000 * 365));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function moveLeft(grille, x, y, flag, grille_size = 4) {
	if(x == 3 && y >= 3) {
		if(flag == 0) {
			randomCell(grille, grille_size);	
		}
		animationLeft();
		return flag;	
	}
	if(y >= 3) {
		return moveLeft(grille, x+1, 0, flag);
	}
	for (x = x; x < grille_size; x++) {
		for (y = y; y < grille_size; y++) {
			if(grille[x][y] == 0) {
				for(k = y+1; k < grille_size; k++) {
					if(grille[x][k] != 0) {
						grille[x][y] = grille[x][k];
						grille[x][k] = 0;
						grilleAnimate.push([x, y, k]);
						 return moveLeft(grille, x, y, 0);
					}
				}
				return moveLeft(grille, x, y+1, flag);
			} else if(grille[x][y] != 0) {
				for(k = y+1; k < grille_size; k++) {
					if(grille[x][k] != 0 && grille[x][k] == grille[x][y]) {
						grille[x][y] = grille[x][k] * 2;
						grilleAnimate.push([x, y, k]);
						if(grille[x][y] == 2048) {
							document.getElementById("winLoose").innerHTML = "win";
						}
						score += grille[x][k] * 2;
						setCookie("score", score, 1);
						if(score >= getCookie("bestScore")) {
							setCookie("bestScore", score, 1);
						}
						grille[x][k] = 0;
						return moveLeft(grille, x, y+1, 0);
					} else if (grille[x][k] != 0 && grille[x][k] != grille[x][y]) {
						return moveLeft(grille, x, y+1, flag);
					}
				}
			}
		}
	}
}

function moveRight(grille, x, y, flag, grille_size = 4) {
	if(x == 0 && y <= 0) {
		if(flag == 0) {
			randomCell(grille, grille_size);	
		}
		animationRight();
		return flag;
	}
	if(y <= 0) {
		return moveRight(grille, x-1, grille_size-1, flag);
	}
	for (x = x; x >= 0; x--) {
		for (y = y; y >= 0; y--) {
			if(grille[x][y] == 0) {
				for(k = y-1; k >= 0; k--) {
					if(grille[x][k] != 0) {
						grille[x][y] = grille[x][k];
						grilleAnimate.push([x, y, k]);
						grille[x][k] = 0;
						 return moveRight(grille, x, y, 0);
					}
				}
				return moveRight(grille, x, y-1, flag);
			} else if(grille[x][y] != 0) {
				for(k = y-1; k >= 0; k--) {
					if(grille[x][k] != 0 && grille[x][k] == grille[x][y]) {
						grille[x][y] = grille[x][k] * 2;
						grilleAnimate.push([x, y, k]);
						if(grille[x][y] == 2048) {
							document.getElementById("winLoose").innerHTML = "win";
						}
						score += grille[x][k] * 2;
						setCookie("score", score, 1);
						if(score >= getCookie("bestScore")) {
							setCookie("bestScore", score, 1);
						}
						grille[x][k] = 0;
						return moveRight(grille, x, y-1, 0);
					} else if (grille[x][k] != 0 && grille[x][k] != grille[x][y]) {
						return moveRight(grille, x, y-1, flag);
					}
				}
			}
		}
	}
}

function moveTop(grille, x, y, flag, grille_size = 4) {
	if(x >= 3 && y == 3) {
		if(flag == 0) {
			randomCell(grille, grille_size);	
		}
		animationTop();
		return flag;
	}
	if(x >= 3) {
		return moveTop(grille, 0, y+1, flag);
	}
	for (y = y; y < grille_size; y++) {
		for (x = x; x < grille_size; x++) {
			if(grille[x][y] == 0) {
				for(k = x+1; k < grille_size; k++) {
					if(grille[k][y] != 0) {
						grille[x][y] = grille[k][y];
						grilleAnimate.push([x, y, k]);
						grille[k][y] = 0;
						 return moveTop(grille, x, y, 0);
					}
				}
				return moveTop(grille, x+1, y);
			} else if(grille[x][y] != 0) {
				for(k = x+1; k < grille_size; k++) {
					if(grille[k][y] != 0 && grille[k][y] == grille[x][y]) {
						grille[x][y] = grille[k][y] * 2;
						score += grille[k][y] * 2;
						setCookie("score", score, 1);
						if(score >= getCookie("bestScore")) {
							setCookie("bestScore", score, 1);
						}
						grilleAnimate.push([x, y, k]);
						if(grille[x][y] == 2048) {
							document.getElementById("winLoose").innerHTML = "win";
						}
						grille[k][y] = 0;
						return moveTop(grille, x+1, y, 0);
					} else if (grille[k][y] != 0 && grille[k][y] != grille[x][y]) {
						return moveTop(grille, x+1, y, flag);
					}
				}
			}
		}
	}
}

function moveBottom(grille, x, y, flag = 1, grille_size = 4) {
	if(x <= 0 && y == 0) {
		if(flag == 0) {
			randomCell(grille, grille_size);	
		}
		animationBottom();
		return flag;
	}
	if(x <= 0) {
		return moveBottom(grille, grille_size-1, y-1, flag);
	}
	for (y = y; y >= 0; y--) {
		for (x = x; x >= 0; x--) {
			if(grille[x][y] == 0) {
				for(k = x-1; k >= 0; k--) {
					if(grille[k][y] != 0) {
						grille[x][y] = grille[k][y];
						grilleAnimate.push([x, y, k]);
						grille[k][y] = 0;
						 return moveBottom(grille, x, y, 0);
					}
				}
				return moveBottom(grille, x-1, y, flag);
			} else if(grille[x][y] != 0) {
				for(k = x-1; k >= 0; k--) {
					if(grille[k][y] != 0 && grille[k][y] == grille[x][y]) {
						grille[x][y] = grille[k][y] * 2;
						grilleAnimate.push([x, y, k]);
						score += grille[k][y] * 2;
						setCookie("score", score, 1);
						if(score >= getCookie("bestScore")) {
							setCookie("bestScore", score, 1);
						}
						if(grille[x][y] == 2048) {
							document.getElementById("winLoose").innerHTML = "win";
						}
						grille[k][y] = 0;
						return moveBottom(grille, x-1, y, 0);
					} else if (grille[k][y] != 0 && grille[k][y] != grille[x][y]) {
						return moveBottom(grille, x-1, y, flag);
					}
				}
			}
		}
	}
}

function randomCell(grille, grille_size = 4) {
	var flag = 1;
	for(l = 0; l < grille_size; l++){
		for(m = 0; m < grille_size; m++) {
			if(grille[l][m] == 0) {
				flag = 0;
				if(Math.random() * 100 > 85) {
					grille[l][m] = 2;
					return true;
				} else if (Math.random() * 100 > 99) {
					grille[l][m] = 4;
					return true;
				}
			}
		}
	}
	if(l == grille_size && m == grille_size && flag == 0) {
		randomCell(grille, grille_size);
	}
}

function animationLeft() {
	if(grilleAnimate != null) {
		var length  = grilleAnimate.length;
		var conteur = 0;
		for (i = 0; i < length; i++) {
			var animX = grilleAnimate[i][0];
			var animY = grilleAnimate[i][1];
			var animK = grilleAnimate[i][2];
			var dest = animK - animY;
			var origine = (animX * 4) + animK + 1;
			var deplacement = (-104.6 * dest) + "px";
			document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.zIndex = conteur;
			var selecteur = ".grille_contenaire>div:nth-of-type("+origine+")";
			lastAnim = selecteur;
			$(selecteur).animate({left: deplacement}, 50);
			if (i == (length - 1)) {
				var wait = setInterval(function() {
				if(!($(selecteur).is(":animated"))) {
				 	clearInterval(wait);
				 	for (x = 0; x < 4; x++) {
						for(y = 0; y < 4; y++) {
				 			document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.left = "0px";
				 			conteur = conteur + 1;
				 		}
				 	}
				 	displayGrille(4, grille);
				 	}
				 }, 200);
			}
			 
		}
		grilleAnimate = [];
	}	
}

function animationRight() {
	if(grilleAnimate != null) {
		var length  = grilleAnimate.length;
		var conteur = 0;
		for (i = 0; i < length; i++) {
			var animX = grilleAnimate[i][0];
			var animY = grilleAnimate[i][1];
			var animK = grilleAnimate[i][2];
			var dest = animY - animK;
			var origine = (animX * 4) + animK + 1;
			var deplacement = (104.6 * dest) + "px";
			document.querySelectorAll(".grille_contenaire>div:nth-of-type("+origine+")")[0].style.zIndex = conteur + 1;
			var selecteur = ".grille_contenaire>div:nth-of-type("+origine+")";
			lastAnim = selecteur;
			$(selecteur).animate({left: deplacement}, 50);
			if (i == (length - 1)) {
				var wait = setInterval(function() {
				if(!($(selecteur).is(":animated"))) {
				 	clearInterval(wait);
				 	for (x = 0; x < 4; x++) {
						for(y = 0; y < 4; y++) {
				 			document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.left = "0px";
				 			conteur = conteur + 1;
				 		}
				 	}
				 	displayGrille(4, grille);
				 	}
				 }, 200);
			}
		}
		grilleAnimate = [];
	}	
}

function animationTop() {
	if(grilleAnimate != null) {
		var length  = grilleAnimate.length;
		var conteur = 0;
		for (i = 0; i < length; i++) {
			var animX = grilleAnimate[i][0];
			var animY = grilleAnimate[i][1];
			var animK = grilleAnimate[i][2];
			var dest = animK - animX;
			var origine = (animK * 4) + animY + 1;
			var deplacement = (-104.6 * dest) + "px";
			document.querySelectorAll(".grille_contenaire>div:nth-of-type("+origine+")")[0].style.zIndex = conteur + 1;
			var selecteur = ".grille_contenaire>div:nth-of-type("+origine+")";
			lastAnim = selecteur;
			$(selecteur).animate({top: deplacement}, 50);
			if (i == (length - 1)) {
				var wait = setInterval(function() {
				if(!($(selecteur).is(":animated"))) {
				 	clearInterval(wait);
				 	for (x = 0; x < 4; x++) {
						for(y = 0; y < 4; y++) {
				 			document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.top = "0px";
				 			conteur = conteur + 1;
				 		}
				 	}
				 	displayGrille(4, grille);
				 	}
				 }, 200);
			}
		}
		grilleAnimate = [];
	}		
}

function animationBottom() {
	if(grilleAnimate != null) {
		var length  = grilleAnimate.length;
		var conteur = 0;
		for (i = 0; i < length; i++) {
			var animX = grilleAnimate[i][0];
			var animY = grilleAnimate[i][1];
			var animK = grilleAnimate[i][2];
			var dest = animX - animK;
			var origine = (animK * 4) + animY + 1;
			var deplacement = (104.6 * dest) + "px";
			document.querySelectorAll(".grille_contenaire>div:nth-of-type("+origine+")")[0].style.zIndex = conteur + 1;
			var selecteur = ".grille_contenaire>div:nth-of-type("+origine+")";
			lastAnim = selecteur;
			$(selecteur).animate({top: deplacement},50);
			if (i == (length - 1)) {
				var wait = setInterval(function() {
				if(!($(selecteur).is(":animated"))) {
				 	clearInterval(wait);
				 	for (x = 0; x < 4; x++) {
						for(y = 0; y < 4; y++) {
				 			document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.top = "0px";
				 			conteur = conteur + 1;
				 		}
				 	}
				 	displayGrille(4, grille);
				 	}
				 }, 200);
			}
		}
		grilleAnimate = [];
	}	
}

function displayGrille(grille_size = 4, grille) {
	var conteur = 0;
	var grilleTmp = new Array(grille_size);
	for (x = 0; x < grille_size; x++) {
		grilleTmp[x] = new Array(grille_size);
		for (y = 0; y < grille_size; y++) {
			grilleTmp[x][y] = grille[x][y];
		}
	}
	gameOver(grilleTmp, 3, 3, 1, 1, 4);
	for (x = 0; x < grille_size; x++) {
		for(y = 0; y < grille_size; y++) {
			document.querySelectorAll(".grille_contenaire>div")[conteur].innerHTML = grille[x][y] === 0 ? "" : grille[x][y];
			document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.zIndex = "0";
			var a = document.querySelectorAll("#selectColor")[0].value;
			switch (grille[x][y]) {
				case 0: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 95%)";break;
				case 2: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 90%)";break;
				case 4: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 85%)";break;
				case 8: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 80%)";break;
				case 16: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 75%)";break;
				case 32: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 70%)";break;
				case 64: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 65%)";break;
				case 128: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 60%)";break;
				case 256: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 55%)";break;
				case 512: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 50%)";break;
				case 1024: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 45%)";break;
				case 2048: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 40%)";break;
				case 4096: document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 35%)";break;
				default : document.querySelectorAll(".grille_contenaire>.grille_cellule")[conteur].style.backgroundColor = "hsl("+a+", 100%, 30%)"; break;
			}
			document.querySelectorAll(".grille_contenaire>.grille_cellule_hide")[conteur].style.backgroundColor = "hsl("+a+", 100%, 95%)";
			conteur = conteur + 1;
		}
		document.querySelectorAll(".grille_contenaire")[0].style.backgroundColor = "hsl("+a+", 100%, 30%)";
		document.querySelectorAll("body")[0].style.backgroundColor = "hsl("+a+", 100%, 95%)";
		document.querySelectorAll("#winLoose, h1")[0].style.color = "hsl("+a+", 100%, 50%)";
		document.querySelectorAll("#winLoose, h1")[1].style.color = "hsl("+a+", 100%, 50%)";
		document.querySelectorAll("select")[0].style.backgroundColor = "hsl("+a+", 100%, 75%)";
		document.querySelectorAll("#score, #newGame, #bestScore")[0].style.backgroundColor = "hsl("+a+", 100%, 75%)";
		document.querySelectorAll("#score, #newGame, #bestScore")[1].style.backgroundColor = "hsl("+a+", 100%, 75%)";
		document.querySelectorAll("#score, #newGame, #bestScore")[2].style.backgroundColor = "hsl("+a+", 100%, 75%)";
		document.querySelectorAll(".arrow-up")[0].style.borderBottomColor = "hsl("+a+", 100%, 75%)";
		document.querySelectorAll(".arrow-down")[0].style.borderTopColor = "hsl("+a+", 100%, 75%)";
		document.querySelectorAll(".arrow-left")[0].style.borderRightColor = "hsl("+a+", 100%, 75%)";
		document.querySelectorAll(".arrow-right")[0].style.borderLeftColor = "hsl("+a+", 100%, 75%)";
	}
	if (getCookie("bestScore") != "") {
		var best = parseInt(getCookie("bestScore"));
	} else {
		var best = 0;
	}
	document.querySelectorAll("#bestScore")[0].innerHTML = "BEST SCORE: "+ best;
	document.querySelectorAll("#score")[0].innerHTML = "<p>SCORE: "+score+"</p><p>Nombre de coup : "+countTouched+"</p>";
	setCookie("grille", grille, 1);
}

function gameOver(grilleTmp, x, y, flag, move, grille_size) {
	if(move == 1) {
		if(x <= 0 && y == 0) {
			return gameOver(grilleTmp, 3, 3, flag, 2, grille_size);
		}
		if(x <= 0) {
			return gameOver(grilleTmp, grille_size-1, y-1, flag, move, grille_size);
		}
		for (y = y; y >= 0; y--) {
			for (x = x; x >= 0; x--) {
				if(grilleTmp[x][y] == 0) {
					for(k = x-1; k >= 0; k--) {
						if(grilleTmp[k][y] != 0) {
							grilleTmp[x][y] = grilleTmp[k][y];
							grilleTmp[k][y] = 0;
							return gameOver(grilleTmp, x, y, 0, move, grille_size);
						}
					}
					return gameOver(grilleTmp, x-1, y, flag, move, grille_size);
				} else if(grilleTmp[x][y] != 0) {
					for(k = x-1; k >= 0; k--) {
						if(grilleTmp[k][y] != 0 && grilleTmp[k][y] == grilleTmp[x][y]) {
							grilleTmp[x][y] = grilleTmp[k][y] * 2;
							grilleTmp[k][y] = 0;
							return gameOver(grilleTmp, x, y, 0, move, grille_size);
						} else if (grilleTmp[k][y] != 0 && grilleTmp[k][y] != grilleTmp[x][y]) {
							return gameOver(grilleTmp, x-1, y, flag, move, grille_size);
						}
					}
				}
			}
		}
	} else if(move == 2 && flag == 1) {
		if(x == 0 && y <= 0) {
			return gameOver(grilleTmp, 0, 0, flag, 3, grille_size);
		}
		if(y <= 0) {
			return gameOver(grilleTmp, x-1, grille_size-1, flag, move, grille_size);
		}
		for (x = x; x >= 0; x--) {
			for (y = y; y >= 0; y--) {
				if(grilleTmp[x][y] == 0) {
					for(k = y-1; k >= 0; k--) {
						if(grilleTmp[x][k] != 0) {
							grilleTmp[x][y] = grilleTmp[x][k];
							grilleTmp[x][k] = 0;
							return gameOver(grilleTmp, x, y, 0, move, grille_size);
						}
					}
					return gameOver(grilleTmp, x, y-1, flag, move, grille_size);
				} else if(grilleTmp[x][y] != 0) {
					for(k = y-1; k >= 0; k--) {
						if(grilleTmp[x][k] != 0 && grilleTmp[x][k] == grilleTmp[x][y]) {
							grilleTmp[x][y] = grilleTmp[x][k] * 2;
							grilleTmp[x][k] = 0;
							return gameOver(grilleTmp, x, y, 0, move, grille_size);
						} else if (grilleTmp[x][k] != 0 && grilleTmp[x][k] != grilleTmp[x][y]) {
							return gameOver(grilleTmp, x, y-1, flag, move, grille_size);
						}
					}
				}
			}
		}
	} else if(move == 3 && flag == 1) {
		if(x >= 3 && y == 3) {
			return gameOver(grilleTmp, 0, 0, flag, 4, grille_size);
		}
		if(x >= 3) {
			return gameOver(grilleTmp, 0, y+1, flag, move, grille_size);
		}
		for (y = y; y < grille_size; y++) {
			for (x = x; x < grille_size; x++) {
				if(grilleTmp[x][y] == 0) {
					for(k = x+1; k < grille_size; k++) {
						if(grilleTmp[k][y] != 0) {
							grilleTmp[x][y] = grilleTmp[k][y];
							grilleTmp[k][y] = 0;
							return gameOver(grilleTmp, x, y, 0, move, grille_size);
						}
					}
					return gameOver(grilleTmp, x+1, y, flag, move, grille_size);
				} else if(grilleTmp[x][y] != 0) {
					for(k = x+1; k < grille_size; k++) {
						if(grilleTmp[k][y] != 0 && grilleTmp[k][y] == grilleTmp[x][y]) {
							grilleTmp[x][y] = grilleTmp[k][y] * 2;
							grilleTmp[k][y] = 0;
							return gameOver(grilleTmp, x, y, 0, move, grille_size);
						} else if (grilleTmp[k][y] != 0 && grilleTmp[k][y] != grilleTmp[x][y]) {
							return gameOver(grilleTmp, x+1, y, flag, move, grille_size);
						}
					}
				}
			}
		}

	} else if(move == 4 && flag == 1) {
		if(x >= 3 && y == 3) {
			return gameOver(grilleTmp, 3, 3, flag, 5, grille_size);
		}
		if(x >= 3) {
			return gameOver(grilleTmp, 0, y+1, flag, move, grille_size);
		}
		for (y = y; y < grille_size; y++) {
			for (x = x; x < grille_size; x++) {
				if(grilleTmp[x][y] == 0) {
					for(k = x+1; k < grille_size; k++) {
						if(grilleTmp[k][y] != 0) {
							grilleTmp[x][y] = grilleTmp[k][y];
							grilleTmp[k][y] = 0;
							return gameOver(grilleTmp, x, y, 0, move, grille_size);
						}
					}
					return gameOver(grilleTmp, x+1, y, flag, move, grille_size);
				} else if(grilleTmp[x][y] != 0) {
					for(k = x+1; k < grille_size; k++) {
						if(grilleTmp[k][y] != 0 && grilleTmp[k][y] == grilleTmp[x][y]) {
							grilleTmp[x][y] = grilleTmp[k][y] * 2;
							grilleTmp[k][y] = 0;
							return gameOver(grilleTmp, x, y, 0, move, grille_size);
						} else if (grilleTmp[k][y] != 0 && grilleTmp[k][y] != grilleTmp[x][y]) {
							return gameOver(grilleTmp, x+1, y, flag, move, grille_size);
						}
					}
				}
			}
		}
	} else {
		if(flag == 1) {
			document.getElementById("winLoose").innerHTML = "Game Over";
		} else {
			countTouched += 1;
			setCookie('countTouched', countTouched, 1);
			console.log(getCookie('countTouched'));
		}
	}
}

document.onkeydown = function(e) {
	if (e.keyCode == 38 || e.keyCode == 87) { if (!$(lastAnim).is(":animated")) {moveTop(grille, 0,0);}}
	else if (e.keyCode == 39 || e.keyCode == 68) { if (!$(lastAnim).is(":animated")) {moveRight(grille, 3,3);}}
	else if (e.keyCode == 40 || e.keyCode == 83) { if (!$(lastAnim).is(":animated")) {moveBottom(grille, 3,3);}}
	else if (e.keyCode == 37 || e.keyCode == 65) { if (!$(lastAnim).is(":animated")) {moveLeft(grille, 0,0);}}	
}

	document.querySelectorAll(".arrow-up")[0].onclick = function () { if (!$(lastAnim).is(":animated")) {moveTop(grille, 0,0);}};
	document.querySelectorAll(".arrow-down")[0].onclick = function () { if (!$(lastAnim).is(":animated")) {moveBottom(grille, 3,3);}};
	document.querySelectorAll(".arrow-left")[0].onclick = function () { if (!$(lastAnim).is(":animated")) {moveLeft(grille, 0,0);}};
	document.querySelectorAll(".arrow-right")[0].onclick = function () { if (!$(lastAnim).is(":animated")) {moveRight(grille, 3,3);}};
	document.querySelectorAll("#newGame")[0].onclick = function () { setCookie('grille', '', 1); setCookie('score', '', 1); setCookie('countTouched', '', 1); grille = newGame(4);};

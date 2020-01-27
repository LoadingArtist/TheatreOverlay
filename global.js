function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

var NoCacheHeaders = new Headers();
NoCacheHeaders.append('pragma', 'no-cache');
NoCacheHeaders.append('cache-control', 'no-cache');

function playRandomFrame(layer,frameRange){
	let i=getRandomInt(frameRange[0],frameRange[1]);
	layer.gotoAndPlay(i);
}

function stopRandomFrame(layer,frameRange){
	let i=getRandomInt(frameRange[0],frameRange[1]);
	layer.gotoAndStop(i);
}

function endAnim(){
	stage.children[0].returnToIdle();
	tableAnim("normal");
}

function anim(animationName){
	stage.children[0].playAnim(animationName);
}

/////////////audience functions

function audience(audAnim){
	stage.children[0].audienceSelector(audAnim);
}

function endAudience(){
	stage.children[0].returnToIdleAudience();
}

///////////// table functions

function tableHide(){
	stage.children[0].theTable.visible = false;
}

function tableShow(){
	stage.children[0].theTable.visible = true;
}

function tableAnim(anim){
	stage.children[0].theTable.gotoAndStop(anim);
}

///////////// alert functions

function endAlert(){
	window.alertActive = false;
}


function pauseAlert(x){
	if (x){
		window.alertPaused = x;
		console.log("notifications paused? : " + window.alertPaused);
	}else{
		if (window.alertPaused == false){
			window.alertPaused = true;
			console.log("notifications PAUSED");
		}else{
			window.alertPaused = false;
			console.log("notifications RESUMED");
		}
	}
}

function startDono(){ //use this at beginning of dono animations if you want hat guy to hide
	stage.children[0].donoMainHide();
}

function endDono(){ //use this at end of dono animations to show hat guy and continue
	stage.children[0].returnToDono();
}

function skipDono(){ //use this to skip dono animation entirely
	stage.children[0].skipDono();
}



//////////// curtain functions

function endCurtain(){
	stage.children[0].curtainReset();
}

//////////// light functions

function light(lightAnim){
	stage.children[0].lightSelector(lightAnim);
}

function endLight(){
	stage.children[0].lightReset();
}

//// used for finding consistent frame based on the username for alertPerson thing
function frameFromUsername(username, maxFrame) {
	let checksum = username.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
	return Math.abs(checksum % maxFrame);
}

function getRandomInt(min, max) {
    return Math.random() * (max - min) + min;
}

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
	stage.children[0].theTable.gotoAndStop("T_DEFAULT");
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

//// used for finding random frame for alertPerson thing
function rngFromID(max) {
	return Math.floor(Math.random() * max);
}

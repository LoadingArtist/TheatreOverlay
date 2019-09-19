this.stop();
const _root = this;

//createjs.Sound.volume = 0.25; //to lower the volume across the whole overlay (might do this in OBS instead)

/// Variables

var currentPriority = 0; // Global 'current action' priority to compare against


// Data structure containing everything we might need to know about each action
var actions = {

  reset:       { rank: 99, animation: "X_RESET" },
	
  empty:       { rank: 20, animation: "X_EMPTY" },

  dono:        { rank: 15, animation: "X_DONO" },
  sub:         { rank: 15,  animation: "X_SUB" },
  raid:        { rank: 15,  animation: "X_RAID" },
  host:        { rank: 15,  animation: "X_HOST" },
  follow:      { rank: 15,  animation: "X_FOLLOW" },
  pledge:      { rank: 15,  animation: "X_PLEDGE" },
  
  kiss:        { rank: 10,  animation: "X_KISS" }, //also need to change AHK!!!!!!!!!!
  love:        { rank: 10,  animation: "X_LOVE" },
  hello:       { rank: 10,  animation: "X_HELLO" },

  drumroll:    { rank: 9,  animation: "X_DRUMROLL" },//
  drumshot:    { rank: 9,  animation: "X_RIMSHOT" },//
  drumcrickets:{ rank: 9,  animation: "X_RIMSHOT_CRICKETS" },//  

  //brbsintro:{ rank: 9,  animation: "BRB_S_INTRO" }, //still need to do!
  //brbsoutro:{ rank: 9,  animation: "BRB_S_OUTRO" },
  
  death:       { rank: 10,  animation: "X_DEATH" },//changed
  deathshort:  { rank: 10,  animation: "X_DEATH_SHORT" },//changed
  skip:        { rank: 9,  animation: "X_SKIP" },
  
  // Interesting medium-priotiry stuff that should win over idles or passive/non-event actions
  countdown:   { rank: 5, animation: "COUNTDOWN" },

  singapplause:{ rank: 5, animation: "SING_APPLAUSE" },
  singlighter: { rank: 5, animation: "SING_LIGHTER" },
  
  s1:          { rank: 5, animation: "X_SING_01" },
  s2:          { rank: 5, animation: "X_SING_02" },
  s3:          { rank: 5, animation: "X_SING_03" },
  sing:        { rank: 5, animation: "X_SING_DEFAULT" },
  
  g1:          { rank: 5, animation: "X_GUITAR_01" },
  g2:          { rank: 5, animation: "X_GUITAR_02" },
  g3:          { rank: 5, animation: "X_GUITAR_03" },

  // Drawing Stuff
  save:        { rank: 6, animation: "D_SAVE" },
  cloud:       { rank: 6, animation: "CLOUD" },
  trash:       { rank: 5, animation: "D_TRASH" },
  frustrated:  { rank: 5, animation: "D_FRUSTRATED" },
  study:       { rank: 3, animation: "D_STUDY" },
  
  de:          { rank: 1, animation: "D_DRAW_END" },
  dr:          { rank: 1, animation: "D_DRAW" },
  er:          { rank: 1, animation: "D_ERASE" },
  
  // Gaming Stuff
  //gscream:     { rank: 6, animation: "G_SCREAM" }, //ignore until better volume detection in place
  gintense01: { rank: 5, animation: "G_INTENSE_01" },
  gintense02: { rank: 5, animation: "G_INTENSE_02" },
  gretreat:    { rank: 3, animation: "G_RETREAT" },  
  
  gplay:    { rank: 1, animation: "G_PLAY" },
  gafk:     { rank: 1, animation: "G_AFK" },
  gdefault: { rank: 1, animation: "G_DEFAULT" },

  // Idle
  idle:      { rank: 0, animation: "X_DEFAULT" }
};

var commands = {
	
//// SET MODE (generic/draw/game)
	
	xxxgeneric: function () {
		stage.children[0].gotoAndStop("_DEFAULT");
		actions.idle.animation = "X_DEFAULT";
		endAnim();
	},
	  
	xxxdraw: function () {
		stage.children[0].gotoAndStop("_DEFAULT");
		actions.idle.animation = "D_DEFAULT";
		endAnim();
	},
	  
	xxxgame: function () {
		stage.children[0].gotoAndStop("_GAME");
		actions.idle.animation = "G_DEFAULT";
		endAnim();
	},
	  
	xxxhide: function () {
		stage.children[0].gotoAndStop("_HIDE");
		endAnim();
	},
	  
	xxxsing: function () {
		actions.idle.animation = "X_SING_DEFAULT";
		endAnim();
		tableAnim("SMOKE");
	},
	  
	xxxguitar: function () {
		actions.idle.animation = "X_GUITAR_01";
		endAnim();
		tableAnim("SMOKE");
	},
	  
	//// CURTAINS
	  
	xintro: function () {
		_root.CURCONTAINER.removeAllChildren();
		let curName = eval("new lib.CUR_INTRO()");
		curName.name = "curAnim";
		_root.CURCONTAINER.addChild(curName);
	},
	  
	xstart: function () {
		_root.CURCONTAINER.getChildByName("curAnim").gotoAndPlay("start");
	},
	  
	xopen: function () {
		_root.CURCONTAINER.getChildByName("curAnim").gotoAndPlay("open");
	},
	  
	xoutro: function () {
		_root.CURCONTAINER.removeAllChildren();
		let curName = eval("new lib.CUR_OUTRO()");
		curName.name = "curAnim";
		_root.CURCONTAINER.addChild(curName);
	}
};


// AUDIENCE COMMANDS
var audienceCommands = {
	auddefault: "AUD_DEFAULT",
	audclap: "AUD_CLAP",
	audlighter: "AUD_LIGHTER",
	audlaugh: "AUD_LAUGH",
	audcrickets: "AUD_CRICKETS",
	audgasp: "AUD_GASP",
	audooh: "AUD_OOH",
};


// LIGHT COMMANDS

var lightCommands = {
	lreset: "L_RESET",
	l3blue: "L_3BLUE",
	l1blue: "L_1BLUE",
	l1orange: "L_1ORANGE",
	l3red: "L_3RED",
	lstaticblue: "L_STATICBLUE",
	lstaticorange: "L_STATICORANGE",
	lstaticred: "L_STATICRED",
	lspot: "L_SPOT",
	lspotanim: "L_SPOTANIM",
}


/// Functions

var command = "";


// Respond to keydown
function handleKey(event) {
    switch (event.keyCode) {
        case 192:
            if (actions.hasOwnProperty(command)) {
                triggerSequence(command);
            } else if (commands.hasOwnProperty(command)) {
                commands[command]();
            } else if (audienceCommands.hasOwnProperty(command)) {
                audCommand(command);
			} else if (lightCommands.hasOwnProperty(command)) {
                lightCommand(command);
            } else {
                console.log("Unsupported command submitted: " + command);                  
            }
            command = "";
            break;
        default:
            if (event.location == 0 && event.key.match(/[a-z0-9\.\-\s]/)) {
                command = command + event.key;
            }
            break;
    } 
}

// Given an action name (note: not an animation name), trigger that sequence provided the priorty is high enough
function triggerSequence (actionName) {
	
  // Fetch action data by name from the above data structure
  var action = actions[actionName];

  // Check priority - if equal or higher, show this animation and set the global priority accordingly
  if (action.rank >= currentPriority) {
	  
	_root.MAINCONTAINER.removeAllChildren();
	  
	let animName = eval( "new lib." + action.animation + "()" );
	animName.name = "charAnim";
	_root.MAINCONTAINER.addChild(animName);
	  
    currentPriority = action.rank;
  }

  // Otherwise, no action is required.

}

this.playAnim = function(animationName) {
	_root.MAINCONTAINER.removeAllChildren();

	let animName = eval( "new lib." + animationName + "()" );
	animName.name = "charAnim";
	_root.MAINCONTAINER.addChild(animName);
}



// When an audience animation is entered it plays this function

function audCommand (animName) {
	var audAnim = audienceCommands[animName];
	console.log(audAnim);
	audience(audAnim);
}


// Call this from an animation when it terminates naturally

this.returnToIdle = function(){
	
  currentPriority = actions.idle.rank;
	_root.MAINCONTAINER.removeAllChildren();
	_root.MAINCONTAINER.addChild( eval( "new lib." + actions.idle.animation + "()" ));
	
}

// Call this to reset curtains (by removing all children from the container)

this.curtainReset = function(){
	_root.CURCONTAINER.removeAllChildren();
}

/// Init

// Listen for keyboard events
window.addEventListener("keydown", handleKey);



///////////// AUDIENCE

this.audienceSelector = function(audAnim){
	_root.AUDCONTAINER.removeAllChildren();
	_root.AUDCONTAINER.addChild( eval( "new lib." + audAnim + "()" ));
}

this.returnToIdleAudience = function(){
	_root.AUDCONTAINER.removeAllChildren();
	_root.AUDCONTAINER.addChild(new lib.AUD_DEFAULT());
}


//////////// LIGHTS

function lightCommand (animName) {
	var lightAnim = lightCommands[animName];
	light(lightAnim);
}

this.lightSelector = function(lightAnim){
	_root.LIGHTCONTAINER.removeAllChildren();
	_root.LIGHTCONTAINER.addChild( eval( "new lib." + lightAnim + "()" ));
}

this.lightReset = function(){
	_root.CURCONTAINER.removeAllChildren();
}


//////////////////////////////////////////////////////////////////
/////////////////       NOTIFICATIONS        /////////////////////
////////// ORIGINAL CODE FROM SCRIBBLEH (THANK YOU!) /////////////
////////////////////// twitch.tv/scribbleh ///////////////////////
//////////////////////////////////////////////////////////////////

// NOTIFICATIONS /STREAMLABS IMPLEMENTATION

alertActive = false; //global variable for global function
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
var lastAlertID = 'lul';
var MessageQueue = [];

var FollowQueue = [];

/////////////////////////////////////////////
////// CONNECT TO SOCKET & FETCH DATA ///////
/////////////////////////////////////////////

const socketToken = "XXXXXXXXXXXXXXXXXXXXXXXXXXX"; //Socket token from /socket/token end point
  
//Connect to socket
const streamlabs = io("https://sockets.streamlabs.com?token=" + socketToken);
//Perform Action on event

// CHECK IF WE ARE CONNECTED
streamlabs.on('connect', function(){
	console.log("connect"); 
});


// FETCH EVENTS
streamlabs.on('event', (eventData) => {
	
	 // STREAMLABS DONATIONS
    if (eventData.type === 'donation') {
		//code to handle donation events
		MessageQueue.push(['donation' ,
			eventData.message[0].from,
			eventData.message[0].amount,
			eventData.message[0].message,
			eventData.message[0].currency
		]);

		checkMessages();

    }
	
	console.log("eventData: " , eventData);
	// TWITCH EVENTS
	if (eventData.for === 'twitch_account') {
		switch(eventData.type) {
		  
			case 'follow':
					MessageQueue.push(['follow',
					eventData.message[0].name
					]);		
					
					console.log("messagequeue before checkMessages(); : " , MessageQueue);
					checkMessages();
			
			break;
				
			case 'subscription':
					MessageQueue.push(['subscription' ,
					eventData.message[0].name,
					eventData.message[0].months,
					eventData.message[0].sub_plan, //1000 = tier 1, 2000 = tier 2, Prime
					eventData.message[0].message,
					eventData.message[0].gifter
					]);
					
					checkMessages();
			
					if(eventData.message[0].gifter == ""){
						console.log("No gifter");
						checkMessages();
					}else{
						console.log(eventData.message[0].gifter);
						checkMessages();
					}

			break;
					
			case 'bits':
					MessageQueue.push(['bits' ,
					eventData.message[0].name,
					eventData.message[0].amount,
					eventData.message[0].message
					]);
					
					checkMessages();
			
			break;
			
			case 'raid':
					MessageQueue.push(['raid' ,
					eventData.message[0].name,
					eventData.message[0].raiders
					]);
					
					checkMessages();
			
			break;
			
			case 'host':
					MessageQueue.push(['host' ,
					eventData.message[0].name,
					eventData.message[0].viewers
					]);
					
					checkMessages();
			
			break;
			
			default:
			//default case
			console.log(eventData.message);
		}

	}else if (eventData.for === 'patreon'){
		switch(eventData.type) {

			case 'pledge':
					MessageQueue.push(['pledge' ,
					eventData.message[0].from,
					eventData.message[0].amount,
					eventData.message[0].formattedAmount,
					eventData.message[0].currency
					]);
					
					checkMessages();
			break;
			
			default:
			//default case
			console.log(eventData.message);
		}
	}
});


///////////////////////////////////
//// QUEUE SYSTEM AND STUFF ///////
///////////////////////////////////


//-------- QUEUE SYSTEM --------
  
function dispatchQueue() {
	var msg = MessageQueue[0];
	var msgType = MessageQueue[0][0];
	var msgData = MessageQueue[0][1];
	
	console.log(MessageQueue[0]);

	
	if(msg != 0){
		if (msgType == 'follow'){
			
			followerAlert(msgData);
			MessageQueue.splice(0, 1);
		
		} 
		else if (msgType == 'subscription'){
			var msgMonths = MessageQueue[0][2];
			var msgPlan = MessageQueue[0][3];
			var msgMessage = MessageQueue[0][4];
			var msgGifter = MessageQueue[0][5];
			
			subAlert(msgData, msgMonths, msgPlan, msgMessage, msgGifter);
			MessageQueue.splice(0, 1);
		} 
		else if (msgType == 'bits'){
			var msgAmount = MessageQueue[0][2];
			var msgMessage = MessageQueue[0][3];

			donoAlert(msgData, msgAmount, msgMessage, msgType);
			MessageQueue.splice(0, 1);
		}  
		else if (msgType == 'raid'){
			var msgRaiders = MessageQueue[0][2];

			raidAlert(msgData, msgRaiders);
			MessageQueue.splice(0, 1);
		} 
		else if (msgType == 'host'){
			var msgViewers = MessageQueue[0][2];

			hostAlert(msgData, msgViewers);
			MessageQueue.splice(0, 1);
		} 
		else if (msgType == 'donation'){
			var msgAmount = MessageQueue[0][2];
			var msgMessage = MessageQueue[0][3];
			var msgCurrency = MessageQueue[0][4];

			donoAlert(msgData, msgAmount, msgMessage, msgType, msgCurrency);
			MessageQueue.splice(0, 1);
		} 
		else if (msgType == 'pledge'){
			var msgAmount = MessageQueue[0][2];
			var msgFormattedAmount = MessageQueue[0][3];
			var msgCurrency = MessageQueue[0][4];

			pledgeAlert(msgData, msgAmount, msgFormattedAmount, msgCurrency);
			MessageQueue.splice(0, 1);
		} 
	}
}


function checkMessages(){
	if(MessageQueue.length > 0){
		if (alertActive == false){
			dispatchQueue();
		} else {
			setTimeout(checkMessages,2000); // If something is playing, check again in 2 seconds or so.
			console.log("There's " + MessageQueue.length + " items left in the queue.");
		}
	}
}



//////////////////////////////
////// PLAY THE ALERTS ///////
//////////////////////////////



// FOLLOWER ALERT


var followField = new createjs.Container();
	followField.regX = 0;
	_root.addChild(followField);
	//_root.setChildIndex(followField,4); doesnt work, only when the default anim fires (thats plugged in manually)?

folMC = "";


function followerAlert(msgData){
	
	//SET STATUS AND DATA
	alertActive = true;
	
	Math.seedrandom(msgData); //create a random seed based on the user ID number
	
	
	let folMC = eval( "new lib.X_FOLLOW()" );
	folMC.name = msgData;

	followField.addChild(folMC);
	
	// get random numbers for character customization
	let bodyNum = rngFromID(followField.getChildByName(folMC.name).followerPerson.body.totalFrames);
	let hatNum = rngFromID(followField.getChildByName(folMC.name).followerPerson.hat.totalFrames);
	
	

	// add username/changing clothes
	setTimeout(() => {
		followField.getChildByName(folMC.name).followerPerson.banner.txtUsername.text = msgData;
		followField.getChildByName(folMC.name).followerPerson.body.gotoAndStop(bodyNum);
		followField.getChildByName(folMC.name).followerPerson.hat.gotoAndStop(hatNum);
		
		setTimeout(() => { // check if hat or body has a label, if so make sure they are both active together
			let bodyLabel = followField.getChildByName(folMC.name).followerPerson.body.currentLabel;
			let hatLabel = followField.getChildByName(folMC.name).followerPerson.hat.currentLabel;
			
			
			//NOTE TO SELF: make it only set body if a hat label was chosen (otherwise
			//there is too high a chance of a set (because we have less body choices)
			//Is there a way to not pick a labeled body if hat wasn't a label?
			//Also seems like keyframes with no label will act as if they do, if they are after a labeled keyframe
			
			if (bodyLabel){
				followField.getChildByName(folMC.name).followerPerson.hat.gotoAndStop(bodyLabel);
				console.log("if bodyLabel>>");
				
			}else if (hatLabel){
				followField.getChildByName(folMC.name).followerPerson.body.gotoAndStop(hatLabel);
				console.log("if hatLabel>>");
			}
		}, 100)	
		
	}, 100);
	

	// REMOVE ITSELF AFTER SOME TIME
	setTimeout(() => {
		followField.removeChild(folMC);
	
	}, 20000);

}



// SUB ALERT

function subAlert(msgData, msgMonths, msgPlan, msgMessage, msgGifter){
	
	//SET STATUS AND DATA
	alertActive = true;
	
	const monthsArray = [1, 3, 6, 12, 24, 36, 48, 60, 72, 84, 96]
	var newBadgeCheck = monthsArray.indexOf(msgMonths);
	
	waitTime = 2000;
	
		
	//ANIMATION
	triggerSequence("sub");

	Math.seedrandom(msgData); //create a random seed based on the user ID number
	
	
	// create random numbers for customization
	let bodyNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames);	
	let hatNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames);

	console.log("name is: " + msgData + " | Months is: " + msgMonths + "| Plan is: " + msgPlan + "| Gifter is: " + msgGifter + " | Message: " + msgMessage + " | bodyNum: " + bodyNum);


	//IS GIFTED?
	setTimeout(() => {
		if (!msgGifter) {
			_root.MAINCONTAINER.getChildByName("charAnim").banner.gotoAndPlay ("normal");
		}else{
			
			//Generate gifter person customization (NOT READY YET)
			//Math.seedrandom(msgGifter);
			//let bodyNumGifter = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames);	
			//let hatNumGifter = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames);
			
			_root.MAINCONTAINER.getChildByName("charAnim").banner.gotoAndPlay("gifted");
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerGifted.txtGifter.text = msgGifter;
		}
		
		//FILL DATA
		_root.MAINCONTAINER.getChildByName("charAnim").banner.txtUsername.text = msgData;
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAbove.text = msgData;
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAboveShadow.text = msgData;
		
		//FILL CUSTOMIZATION
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(bodyNum);
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(hatNum);
		
		setTimeout(() => { // check if hat or body has a label, if so make sure they are both active together
			let bodyLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.currentLabel;
			let hatLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.currentLabel;
			
			if (bodyLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(bodyLabel);
			}else if (hatLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(hatLabel);
			}
		}, 100)	
		
		
		if (msgPlan == "1000"){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubBG.gotoAndStop("tier1");
		}else if (msgPlan == "2000"){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubBG.gotoAndStop("tier2");
		}else if (msgPlan == "3000"){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubBG.gotoAndStop("tier3");
		}else{
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubBG.gotoAndStop("tier1");
			_root.MAINCONTAINER.getChildByName("charAnim").banner.gotoAndPlay("prime");
			//audience to talk about how to get a free prime sub
		}
		
		
	}, 100);
		
		
	////// DETAIL TEXT
	
	setTimeout(() => {
		if (msgMonths > 1){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubDetail.txtMonths.text = msgMonths;
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubDetail.gotoAndStop("resub");

		}else{
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubDetail.txtMonths.text = "";
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubDetail.gotoAndStop("new");
			//audience waving WELCOME sign?
		}
	}, 100);

		
	///// BADGE		
			
	setTimeout(() => {
				
		if (msgMonths == 1){ // NEW SUBSCRIBER
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge1");
			console.log("1 msgMonths: " + msgMonths);

		}else if (msgMonths > 1 && msgMonths < 3){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge1");
			console.log("1elseif msgMonths: " + msgMonths);
			
		}else if (msgMonths >= 3 && msgMonths < 5){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge3");
			console.log("3 msgMonths: " + msgMonths);
			
		}else if (msgMonths >= 6 && msgMonths < 12){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge6");
			console.log("6 msgMonths: " + msgMonths);
			
		}else if (msgMonths >= 12 && msgMonths < 24){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge12");
			console.log("12 msgMonths: " + msgMonths);

		}else if (msgMonths >= 24 && msgMonths < 36){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge24");
			console.log("24 msgMonths: " + msgMonths);
			
		}else{
			console.log("ELSE??? msgMonths: " + msgMonths);
		}
	}, 100);
		

		
	///// SUB REACHED NEW BADGE?
	
	if (newBadgeCheck != -1) { // if milestone badge
		_root.MAINCONTAINER.getChildByName("charAnim").banner.newBadge.visible = true;
		//'new badge' overlay on top of existing notification, and we display it
	}else{
		_root.MAINCONTAINER.getChildByName("charAnim").banner.newBadge.visible = false;
	}	
	
	
	///// SUB HAS MESSAGE?
	setTimeout(() => {
		if (msgMessage){
			
			if (msgMessage.length <= 20){
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("tiny");
				waitTime = 3000;
			}else if (msgMessage.length <= 45){
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("small");
				waitTime = 4000;
			}else if (msgMessage.length <= 75){
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("medium");
				waitTime = 5000;
			}else if (msgMessage.length <= 200){
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("big");
				waitTime = 6000;
			}else if (msgMessage.length <= 350){
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("huge");
				waitTime = 8000;
			}else{
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("huge");
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.maxWidth = 780;
				waitTime = 8000;
			}

			_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.text = msgMessage;
			
			//centers the text to the speech bubble
			var txtHeight = _root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.getMeasuredHeight();
			_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.y = _root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.speechBG.y - txtHeight / 2;
			
			
		}else{
			_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("off");
			_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.text = "";
		}
	}, 100); 
	

	
}


// DONATION/BITS ALERT

this.donoMainHide = function(){
	_root.MAINCONTAINER.getChildByName("charAnim").gotoAndPlay("mainHide"); //hides hat guy to play dono animation
}

this.returnToDono = function(){
	_root.MAINCONTAINER.getChildByName("charAnim").gotoAndPlay("mainShow"); //shows hatguy get back up and continues dono
	_root.DONOCONTAINER.removeAllChildren();
}

this.skipDono = function(){
	_root.MAINCONTAINER.getChildByName("charAnim").gotoAndPlay("skip"); //skips to end of dono with hat guy always visible
	_root.DONOCONTAINER.removeAllChildren();
}



function donoAlert(msgData, msgAmount, msgMessage, msgType, msgCurrency){

	waitTime = 3000;	
	
	
	//Finds true amount (converts dollars into bits)
	var trueAmount = msgAmount;

	if (msgType == "donation"){
		trueAmount = trueAmount * 100;
	}
	
	//Checks if it's at least 100 bits to fire notifications
	if (trueAmount < 100){
		console.log("Amount too low: " + trueAmount);
		
	}else{
		
		//SET STATUS AND DATA
		alertActive = true;
		//_root.MAINCONTAINER.getChildByName("charAnim").donoAnimContainer.removeAllChildren();
		

		//ANIMATION
		triggerSequence("dono");
		
		Math.seedrandom(msgData); //create a random seed based on the user ID number
	
		// create random numbers for customization
		let bodyNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames);	
		let hatNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames);
		
		//FILL DATA
		_root.MAINCONTAINER.getChildByName("charAnim").banner.txtUsername.text = msgData;
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAbove.text = msgData;
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAboveShadow.text = msgData;
		
		//FILL CUSTOMIZATION
		
		setTimeout(() => {
			_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(bodyNum);
			_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(hatNum);
			
			setTimeout(() => { // check if hat or body has a label, if so make sure they are both active together
				let bodyLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.currentLabel;
				let hatLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.currentLabel;
				
				if (bodyLabel){
					_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(bodyLabel);
				}else if (hatLabel){
					_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(hatLabel);
				}
			}, 100)				
			
		}, 100); 
				
		// BITS vs DONATIONS text
		if (msgType == "bits"){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.txtDetails.text = "cheered " + msgAmount + " bits!";
			_root.MAINCONTAINER.getChildByName("charAnim").plusAmount.txtAmount.text = "+" + msgAmount;
		}else{
			_root.MAINCONTAINER.getChildByName("charAnim").banner.txtDetails.text = "tipped " + msgCurrency + " " + msgAmount +"!";
			_root.MAINCONTAINER.getChildByName("charAnim").plusAmount.txtAmount.text = "+" + msgAmount + " " + msgCurrency;
		}	
		
			
		// DIFFERENT ANIMATIONS FOR DIFFERENT AMOUNTS
		setTimeout(() => {
			if (trueAmount == 100) {
				_root.DONOCONTAINER.addChild(new lib.X_DONO_1());
			}else if (trueAmount == 300) {
				_root.DONOCONTAINER.addChild(new lib.X_DONO_2());
			}else if (trueAmount >= 500) {
				_root.DONOCONTAINER.addChild(new lib.X_DONO_0());;
			}else{
				_root.DONOCONTAINER.addChild(new lib.X_DONO_0());
				console.log("is not a special one");
			}
		}, 100); //was 4500//waits before firing the above donation animation (giving hatguy enough time to duck down)
		
		
		///// DONO HAS MESSAGE?
		setTimeout(() => {
			if (msgMessage){
				
				if (msgMessage.length <= 20){
					_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("tiny");
					waitTime = 3000;
				}else if (msgMessage.length <= 45){
					_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("small");
					waitTime = 4000;
				}else if (msgMessage.length <= 75){
					_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("medium");
					waitTime = 5000;
				}else if (msgMessage.length <= 200){
					_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("big");
					waitTime = 6000;
				}else if (msgMessage.length <= 350){
					_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("huge");
					waitTime = 8000;
				}else{
					_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("huge");
					_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.maxWidth = 780;
					waitTime = 8000;
				}

				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.text = msgMessage;
				
				//centers the text to the speech bubble
				var txtHeight = _root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.getMeasuredHeight();
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.y = _root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.speechBG.y - txtHeight / 2;
				
				
			}else{
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.gotoAndStop("off");
				_root.MAINCONTAINER.getChildByName("charAnim").alertSpeech.txtMessage.text = "";
			}
		}, 100); 
	
	}
	
}


// PATREON PLEDGE

function pledgeAlert(msgData, msgAmount, msgFormattedAmount, msgCurrency){

	//SET STATUS AND DATA
	alertActive = true;

	//ANIMATION
	triggerSequence("pledge");
	

	//CHARACTER CUSTOMIZATION
	
	Math.seedrandom(msgData); //create a random seed based on the user ID number
	
	// create random numbers for customization
	let bodyNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames);	
	let hatNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames);
	
	setTimeout(() => {
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(bodyNum);
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(hatNum);
		
		setTimeout(() => { // check if hat or body has a label, if so make sure they are both active together
			let bodyLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.currentLabel;
			let hatLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.currentLabel;
			
			if (bodyLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(bodyLabel);
			}else if (hatLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(hatLabel);
			}
		}, 100)	
		
	}, 100); 
			
	
	//FILL DATA
	let nameSplit = msgData.split(" "); //get first name only
	
		_root.MAINCONTAINER.getChildByName("charAnim").banner.txtUsername.text = nameSplit[0];
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAbove.text = nameSplit[0];
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAboveShadow.text = nameSplit[0];
		
	setTimeout(() => {		
		_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubDetail.txtDetails.text = "JUST BECAME A " + msgFormattedAmount + " PATRON!";
		_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubDetail.gotoAndStop("pledge");
		
		console.log(msgFormattedAmount);
		console.log(_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubDetail.txtDetails);
	}, 100);
		
	setTimeout(() => {
		//CHOOSE BANNER (WHICH TIER)
		if (msgAmount == "1"){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubBG.gotoAndStop("tier1");
		}else if (msgAmount == "4"){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubBG.gotoAndStop("tier2");
		}else if (msgAmount == "10"){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubBG.gotoAndStop("tier3");
		}else{
			_root.MAINCONTAINER.getChildByName("charAnim").banner.bannerSubBG.gotoAndStop("tier1");
		}
	}, 100);
		
}



// RAID ALERT

function raidAlert(msgData, msgRaiders){
	
	//SET STATUS AND DATA
	alertActive = true;
	
	waitTime = 1000;
	
	console.log("Raider is: " + msgData + " | with this many raiders: " + msgRaiders );
	
	//ANIMATION
	triggerSequence("raid");

	_root.MAINCONTAINER.getChildByName("charAnim").txtUsername.text = msgData;
	_root.MAINCONTAINER.getChildByName("charAnim").txtUsernameShadow.text = msgData;
	_root.MAINCONTAINER.getChildByName("charAnim").txtDetails.text = "IS RAIDING WITH " + msgRaiders + " PEOPLE";


	///// LENGTH TO WAIT DEPENDING ON HOW MANY RAIDERS
	setTimeout(() => {

		if (msgRaiders <= 5){
			waitTime = 1000;
		}else if (msgRaiders <= 25){
			waitTime = 3000;
		}else if (msgRaiders <= 75){
			waitTime = 5000;
		}else{
			waitTime = 10000;
		}
			
	}, 100); 	
}


// HOST ALERT

function hostAlert(msgData, msgViewers){
	
	//SET STATUS AND DATA
	alertActive = true;	
		
	//ANIMATION
	triggerSequence("host");

	Math.seedrandom(msgData); //create a random seed based on the user ID number
	
	// create random numbers for customization
	let bodyNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames);	
	let hatNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames);

	console.log("name is: " + msgData + " | Viewers is: " + msgViewers);


	//IS GIFTED?
	setTimeout(() => {
		
		//FILL DATA
		_root.MAINCONTAINER.getChildByName("charAnim").banner.txtUsername.text = msgData;
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAbove.text = msgData;
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAboveShadow.text = msgData;
		
		//FILL DETAIL TEXT
		if (msgViewers > 1){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.txtDetails.text = "HOSTED FOR " + msgViewers + " VIEWERS!";

		}else{
			_root.MAINCONTAINER.getChildByName("charAnim").banner.txtDetails.text = "JUST HOSTED THE CHANNEL!";
		}
		
		//FILL CUSTOMIZATION
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(bodyNum);
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(hatNum);
		
		setTimeout(() => { // check if hat or body has a label, if so make sure they are both active together
			let bodyLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.currentLabel;
			let hatLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.currentLabel;
			
			if (bodyLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(bodyLabel);
			}else if (hatLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(hatLabel);
			}
		}, 100)	
		
		
	}, 100);

	
}

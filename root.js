this.stop();
const _root = this;

//createjs.Sound.volume = 0.25; //to lower the volume across the whole overlay (might do this in OBS instead)

/// Variables

var currentPriority = 0; // Global 'current action' priority to compare against


// Data structure containing everything we might need to know about each action
var actions = {

  reset:       { rank: 99, animation: "X_RESET" },
  pause:       { rank: 99, animation: "X_PAUSE" }, //pauses notifications
	
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
		tableAnim("normal");
	},
	  
	xxxdraw: function () {
		stage.children[0].gotoAndStop("_DEFAULT");
		actions.idle.animation = "D_DEFAULT";
		endAnim();
		tableAnim("normal");
	},
	  
	xxxgame: function () {
		stage.children[0].gotoAndStop("_GAME");
		actions.idle.animation = "G_DEFAULT";
		endAnim();
		tableAnim("normal");
	},
	  
	xxxhide: function () {
		stage.children[0].gotoAndStop("_HIDE");
		endAnim();
		tableAnim("normal");
	},
	  
	xxxsing: function () {
		actions.idle.animation = "X_SING_DEFAULT";
		endAnim();
		tableAnim("smoke");
	},
	  
	xxxguitar: function () {
		actions.idle.animation = "X_GUITAR_01";
		endAnim();
		tableAnim("smoke");
	},
	  
	//// CURTAINS
	  
	xintro: function () {
		_root.CURCONTAINER.removeAllChildren();
		let curName = new lib.CUR_INTRO();
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
		let curName = new lib.CUR_OUTRO();
		curName.name = "curAnim";
		_root.CURCONTAINER.addChild(curName);
	},
	
	
	///// THEME CHOICE
	//
	//tttnormal: function () {
	//	changeTheme(this.stage,"normal");
	//},
	//tttxmas: function () {
	//	changeTheme(this.stage,"xmas");
	//},
	//ttthalloween: function() {
	//	changeTheme(this.stage,"halloween");
	//},
	

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
	l1: "L_1",
	l2: "L_2",
	l3: "L_3",
	l4: "L_4",
	l5: "L_5",
	l6: "L_6",
	l7: "L_7",
	l8: "L_8",
	l9: "L_9",
	lspot: "L_SPOT",
	lspotanim: "L_SPOTANIM",
}

/////////// THEMES

//var theme = "normal";

//var themeProtos = [
//	lib.T_DEFAULT.prototype,
//	lib.curtain.prototype,
//	lib.CURTAIN_L.prototype,
//	lib.CURTAIN_R.prototype
//];

//function changeTheme(parent, theme) {
//	if(parent.children) {
//		for(let i = 0, l = parent.children.length; i < l; i++) {
//			let child = parent.children[i];
//			if(themeProtos.indexOf(child.__proto__) != -1) {
//				child.gotoAndStop(theme);
//			} else {
//				changeTheme(child, theme);
//			}
//		}
//	}
//}





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

/// RAIDING STUFF FROM BAZ

/* Class that contains the data needed to distribute callbacks along a "timeline"*/
class DistributionData
{
    constructor(count, delayBetweenCallbacksPerSegment, distributionPerSegment){
      /*
        Count
          number of wanted callbacks, you want callbacks so you can run your own code!
        DelayBetweenCallbacksPerSegment
          A list of delays in seconds per-segment. These delays is the amount of time waited between callback calls. ie [0.4, 0.8, 1] .. wait 0.4 seconds for callbacks in the first section, wait 0.8 seconds for the callbacks in the second section
        DistributionPerSegment
          A list of percentage values that describe what percentage of `Count` will be spawned in that second. [0.5, 0.2]. 50% of the `Count` will be called in the first-section with the delay specified in the first element of DelayBetweenCallbacksPerSegment will be used.
      */
      this.count = count; // Number of points we want callbacks for
      this.numberOfSegments = delayBetweenCallbacksPerSegment.length;
      this.gapBetweenSpawnPerSegment = delayBetweenCallbacksPerSegment; // seconds
      this.distributionPerSegment = distributionPerSegment;  // list containing the number of callbacks per segement
      this.distribution = this.calculateDistribution();
    }

    calculateDistribution(){
      let distribution = [];
      if(this.numberOfSegments == 0) {return [];}

      /* Determine how many callbacks should be called
        For the first section. Round it up since if there is just 1 callback then we want it spawned in this first segment*/
      distribution.push(Math.ceil(this.distributionPerSegment[0]*this.count));
      let numCallbacksAssigned = distribution[0];
      for (let i = 1; i < this.numberOfSegments; i++) {
        // For the second second, round up. If the calculated number of callbacks is greater than what is left to be spawned then just spawn what is left
        distribution.push(Math.min( Math.ceil(this.distributionPerSegment[i]*this.count), this.count-numCallbacksAssigned)); // 
        numCallbacksAssigned = numCallbacksAssigned + distribution[distribution.length-1];
      }
      return distribution;
    }
}

function executeCallbackDistribution(distributionData, callback, finishedCallBack){
  /*
    distributionData: Data for how the callbacks are distributed across the count range
    callback: Function to call after the specified delay for the current segment
    finishedCallBack: Function to call once completed running through the distribution
  */
    let totalCallbacksTriggered = 0; // Totaal number of times the 
    let numCallbacksTriggeredForSegment = 0 ; // Number of times we have triggered the callback
    let currentSegment = 0;
  
    function callbackWrapper(){
      numCallbacksTriggeredForSegment++;
      totalCallbacksTriggered++;
      callback(totalCallbacksTriggered);
  
      if(numCallbacksTriggeredForSegment >= distributionData.distribution[currentSegment]){
        currentSegment++;
        numCallbacksTriggeredForSegment=0; // reset the count since we work in relative segment callback counts, not total numbers of callbacks
      }
  
      if(currentSegment < distributionData.distribution.length && numCallbacksTriggeredForSegment < distributionData.distribution[currentSegment]){
        setTimeout(
           callbackWrapper,
           distributionData.gapBetweenSpawnPerSegment[currentSegment]*1000
        );
      }
      else{
        finishedCallBack();
      }
    }

    if(distributionData.count > 0){
      // start off the whole process  
      callbackWrapper();
    }
    else{
      // for the case where you pass in zero, this function does nothing and will just call the finished callback
      finishedCallBack();
    }
  }
  
  
function randomRaider(){
	
	let r = Math.random().toString(36).substring(7);//create a random seed based on the user ID number

	let raiderSingle = new lib.X_RAIDER();

	raiderSingle.y += getRandomInt(0, 101);

	//raidField.addChild(raiderSingle);

	console.log("hello does this work?", raiderSingle.y);

	// get random numbers for character customization
	let bodyNum = rngFromID(raiderSingle.followerPerson.body.totalFrames,r);
	let hatNum = rngFromID(raiderSingle.followerPerson.hat.totalFrames,r);


	// add username/changing clothes	
	setTimeout(() => {
		raiderSingle.followerPerson.body.gotoAndStop(bodyNum);
		raiderSingle.followerPerson.hat.gotoAndStop(hatNum);
		}, 100)	
		
	return raiderSingle;
}
  
var raidField = new createjs.Container();
raidField.regX = 0;
_root.addChild(raidField);
let raiderLibrary = [];
const raiderLibraryCount = 30;

for (let i=0; i<raiderLibraryCount; i++){
	raiderLibrary.push(randomRaider());
}


function spawnRaider(num){
	/* This is the point where you would spawn your Raider icon to represent someone raiding you! */
	console.log("Spawn raider here", num);	
	let rnd = getRandomInt(0,raiderLibraryCount);

	console.log(rnd);
	
	//debugger;
	raidField.addChild(raiderLibrary[parseInt(rnd, 10)]);
}
  
  function done(){
    /* a callback to tell your othersystems that the raid spawning is complete, but not nessessarily that the animation is completed! */
   console.log("alldone");
  }





//////////////////////////////////////////////////////////////////
/////////////////       NOTIFICATIONS        /////////////////////
////////// ORIGINAL CODE FROM SCRIBBLEH (THANK YOU!) /////////////
////////////////////// twitch.tv/scribbleh ///////////////////////
//////////////////////////////////////////////////////////////////

// NOTIFICATIONS /STREAMLABS IMPLEMENTATION

alertActive = false; //global variable for global function
alertPaused = false; //global variable for pausing and unpausing notifications

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
var lastAlertID = 'lul';

var MessageQueue = [];

var FollowQueue = [];

/////////////////////////////////////////////
////// CONNECT TO SOCKET & FETCH DATA ///////
/////////////////////////////////////////////

//const socketToken read from external file

//Connect to socket
const streamlabs = io("https://sockets.streamlabs.com?token=" + socketToken);
//Perform Action on event

// CHECK IF WE ARE CONNECTED
streamlabs.on('connect', function(){
	console.log("connect"); 
});

class DonationEvent {
	parseJson(eventData){
		console.log("New donation payload: ", eventData);
		this.from = eventData.message[0].from;
		this.message = eventData.message[0].message;
		this.amount = eventData.message[0].amount;
		this.currency = eventData.message[0].currency;
	}

	process(){
		donoAlert(this.from.toLowerCase(), this.amount, this.message, DonationEvent.prototype.type, this.currency);
	}
}
DonationEvent.prototype.type = 'donation';

class FollowEvent {
	parseJson(eventData){
		this.name = eventData.message[0].name;
	}

	process(){
		followerAlert(this.name.toLowerCase());
	}
}
FollowEvent.prototype.type = 'follow';

class SubscriptionEvent {
	parseJson(eventData){
		this.name = eventData.message[0].name;
		this.months = eventData.message[0].months;
		this.sub_plan = eventData.message[0].sub_plan; //1000 = tier 1, 2000 = tier 2, Prime
		this.message = eventData.message[0].message;
		this.gifter = '';

		if(eventData.message[0].hasOwnProperty("gifter") && eventData.message[0].gifter){
			this.gifter = eventData.message[0].gifter;
		}

	}

	process(){
		subAlert(this.name.toLowerCase(), this.months, this.sub_plan, this.message, this.gifter.toLowerCase());
	}
}
SubscriptionEvent.prototype.type = 'subscription';

class BitsEvent {
	parseJson(eventData){
		this.name = eventData.message[0].name;
		this.amount = eventData.message[0].amount;
		this.message = eventData.message[0].message;		
	}

	process(){
		donoAlert(this.name.toLowerCase(), this.amount, this.message, BitsEvent.prototype.type);
	}
}
BitsEvent.prototype.type = 'bits';

class RaidEvent {
	parseJson(eventData){
		this.name = eventData.message[0].name;
		this.raiders = eventData.message[0].raiders;
	}

	process(){
		raidAlert(this.name.toLowerCase(), this.raiders);
	}
}
RaidEvent.prototype.type = 'raid';

class HostEvent {
	parseJson(eventData){
		this.name = eventData.message[0].name;
		this.viewers = eventData.message[0].viewers;
	}

	process(){
		hostAlert(this.name.toLowerCase(), this.viewers);
	}
}
HostEvent.prototype.type = 'host';

class PledgeEvent {			

	parseJson(eventData){
		this.from = eventData.message[0].from;
		this.amount = eventData.message[0].amount;
		this.formattedAmount = eventData.message[0].formattedAmount;
		this.currency = eventData.message[0].currency;
	}

	process(){
		pledgeAlert(this.from.toLowerCase(), this.amount, this.formattedAmount, this.currency);
	}
}
PledgeEvent.prototype.type = 'pledge';


StreamLabSupportedEventTypes = { 
	"twitch_account" : [DonationEvent, SubscriptionEvent, FollowEvent, HostEvent, BitsEvent, RaidEvent],
	"streamlabs" : [DonationEvent],
	"patreon" : [PledgeEvent],
	"youtube_account" : {},
	"mixer_account" : {}
}

// FETCH EVENTS
streamlabs.on('event', (eventData) => {

	function isType(event){
		return event.prototype.type === eventData.type;
	}

	// if there is no 'for' specified, map it to the 'streamlabs' entry
	let platform = (eventData.for) ? eventData.for : "streamlabs";

	// check the supported event map to see if we support events from this platform
	if ( StreamLabSupportedEventTypes.hasOwnProperty(platform) ){
		let eventClass = StreamLabSupportedEventTypes[platform].find(isType);
		
		if (eventClass){
			let newEvent = new eventClass();
			newEvent.parseJson(eventData);
			// create a new object of the event and queue this event
			MessageQueue.push(newEvent);
			console.log("1) Created new event");
			checkMessages();
		}
		else{
			console.log("Unsupported event type '", eventData.type, "' on platform '", platform, "'");	
			console.log(eventData);
		}
	}
	else{
		console.log("Unsupported platform ", platform);	
		console.log(eventData);
	}
});


///////////////////////////////////
//// QUEUE SYSTEM AND STUFF ///////
///////////////////////////////////


//-------- QUEUE SYSTEM --------
  
function dispatchQueue() {
	
	var msg = MessageQueue[0];
	console.log("2) Displaching Message for event type ", msg.__proto__.type);
	if(msg){
		msg.process();
		console.log("3) Process called for event type ", msg.__proto__.type);
	}
	else{
		console.log("Invalid message found in queue, ejecting it");
	}
	console.log("4a) Pre pop off the MessageQueue ", MessageQueue);
	MessageQueue.shift(); // pop off the processed message
	console.log("4b) Post pop off the MessageQueue ", MessageQueue);
}


function checkMessages(){
	if(MessageQueue.length > 0){
		console.log("Attempting to dispatch message queue of size %s, alertActive: %s alertPause: %s ", MessageQueue.length, alertActive, alertPaused)
		if (alertActive == false && alertPaused == false){
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
	
	
	
	
	let folMC = new lib.X_FOLLOW();
	folMC.name = msgData;

	followField.addChild(folMC);
	
	// get random numbers for character customization
	let bodyNum = rngFromID(followField.getChildByName(folMC.name).followerPerson.body.totalFrames,msgData);
	let hatNum = rngFromID(followField.getChildByName(folMC.name).followerPerson.hat.totalFrames,msgData);
	
	console.log("Follow: " + msgData + " | bodyNum: " + bodyNum + " | hatNum: " + hatNum);

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
			
			if (hatLabel){
				followField.getChildByName(folMC.name).followerPerson.body.gotoAndStop(hatLabel);
				//console.log("if hatLabel>>");
			}
		}, 100)	
		
	}, 100);
	

	// REMOVE ITSELF AFTER SOME TIME
	setTimeout(() => {
		followField.removeChild(folMC);
	
	}, 20000);

}



// SUB ALERT


var subField = new createjs.Container();
	subField.regX = 0;
	_root.addChild(subField);

subMC = "";

function subAlert(msgData, msgMonths, msgPlan, msgMessage, msgGifter){
	
	subField.removeAllChildren();
	let subMC = new lib.X_SUB_DROP();
	subMC.name = msgData;

	subField.addChild(subMC);
	
	//SET STATUS AND DATA
	alertActive = true;
	
	const monthsArray = [1, 3, 6, 12, 24, 36, 48, 60, 72, 84, 96]
	var newBadgeCheck = monthsArray.indexOf(msgMonths);
	
	waitTime = 2000;
	
		
	//ANIMATION
	triggerSequence("sub");
	
	
	// create random numbers for customization
	let bodyNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames, msgData);	
	let hatNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames, msgData);
	
	console.log("Sub: " + msgData + " | bodyNum: " + bodyNum + " | hatNum: " + hatNum);

	//IS GIFTED?
	setTimeout(() => {
		if (!msgGifter) {
			subField.getChildByName(subMC.name).banner.gotoAndPlay("normal");
			//subField.getChildByName(subMC.name).banner.bannerSubBG.gifter.visible = false;
		}else{
			
			//waitTime = 3000; //to make it stay a bit longer when it's a gifted sub?
			
			//Generate gifter person customization
			let bodyNumGifter = rngFromID(subField.getChildByName(subMC.name).banner.bannerGifted.gifter.body.totalFrames, msgGifter);	
			let hatNumGifter = rngFromID(subField.getChildByName(subMC.name).banner.bannerGifted.gifter.hat.totalFrames, msgGifter);
			
			console.log("Gifter: " + msgGifter + " | bodyNum: " + bodyNumGifter + " | hatNum: " + hatNumGifter);
			
			subField.getChildByName(subMC.name).banner.bannerGifted.txtGifter.text = "Gifted by " + msgGifter;
			
			subField.getChildByName(subMC.name).banner.bannerGifted.gifter.body.gotoAndStop(bodyNumGifter);
			subField.getChildByName(subMC.name).banner.bannerGifted.gifter.hat.gotoAndStop(hatNumGifter);
			
			setTimeout(() => {
				subField.getChildByName(subMC.name).banner.gotoAndPlay("gifted");
			}, 5000);
		}
		
		//FILL DATA
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAbove.text = msgData;
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAboveShadow.text = msgData;
		
		subField.getChildByName(subMC.name).banner.bannerSubBG.txtUsername.text = msgData;
		
		//FILL CUSTOMIZATION
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(bodyNum);
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(hatNum);
		
		setTimeout(() => { // check if hat or body has a label, if so make sure they are both active together
			let bodyLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.currentLabel;
			let hatLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.currentLabel;
			
			if (hatLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(hatLabel);
			}
			
			let bodyGifterLabel = subField.getChildByName(subMC.name).banner.bannerGifted.gifter.body.currentLabel;
			let hatGifterLabel = subField.getChildByName(subMC.name).banner.bannerGifted.gifter.hat.currentLabel;
			
			if (hatGifterLabel){
				subField.getChildByName(subMC.name).banner.bannerGifted.gifter.body.gotoAndStop(hatGifterLabel);
			}
		}, 100)	
		
		
		if (msgPlan == "1000"){
			subField.getChildByName(subMC.name).banner.bannerSubBG.gotoAndStop("tier1");
		}else if (msgPlan == "2000"){
			subField.getChildByName(subMC.name).banner.bannerSubBG.gotoAndStop("tier2");
		}else if (msgPlan == "3000"){
			subField.getChildByName(subMC.name).banner.bannerSubBG.gotoAndStop("tier3");
		}else{
			subField.getChildByName(subMC.name).banner.bannerSubBG.gotoAndStop("tier1");
			subField.getChildByName(subMC.name).banner.gotoAndPlay("prime");
		}
		
		
	}, 100);
		
		
	////// DETAIL TEXT
	
	setTimeout(() => {
		if (msgMonths > 1){
			subField.getChildByName(subMC.name).banner.bannerSubDetail.txtMonths.text = msgMonths;
			subField.getChildByName(subMC.name).banner.bannerSubDetail.gotoAndStop("resub");
		}else{
			//audience waving WELCOME sign?
			subField.getChildByName(subMC.name).banner.bannerSubDetail.txtMonths.text = "";
			subField.getChildByName(subMC.name).banner.bannerSubDetail.gotoAndStop("new");
		}
	}, 100);

		
	///// BADGE		
			
	setTimeout(() => {
				
		if (msgMonths == 1){ // NEW SUBSCRIBER
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge1");


		}else if (msgMonths > 1 && msgMonths < 3){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge1");

			
		}else if (msgMonths >= 3 && msgMonths < 5){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge3");

			
		}else if (msgMonths >= 6 && msgMonths < 12){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge6");

			
		}else if (msgMonths >= 12 && msgMonths < 24){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge12");


		}else if (msgMonths >= 24 && msgMonths < 36){
			_root.MAINCONTAINER.getChildByName("charAnim").badgeMC.gotoAndStop("badge24");

			
		}else{
			console.log("ELSE??? msgMonths: " + msgMonths);
		}
	}, 100);
		

		
	///// SUB REACHED NEW BADGE?
	
	if (newBadgeCheck != -1) { // if milestone badge
		subField.getChildByName(subMC.name).banner.newBadge.visible = true;
		//'new badge' overlay on top of existing notification, and we display it
	}else{
		subField.getChildByName(subMC.name).banner.newBadge.visible = false;
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



// PATREON PLEDGE

function pledgeAlert(msgData, msgAmount, msgFormattedAmount, msgCurrency){
	
	subField.removeAllChildren();
	let subMC = new lib.X_SUB_DROP();
	subMC.name = msgData;

	subField.addChild(subMC);

	//SET STATUS AND DATA
	alertActive = true;

	//ANIMATION
	triggerSequence("pledge");
	

	//CHARACTER CUSTOMIZATION
	 

	
	// create random numbers for customization
	let bodyNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames, msgData);	
	let hatNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames, msgData);
	
	console.log("Patreon: " + msgData + " | bodyNum: " + bodyNum + " | hatNum: " + hatNum);
	
	setTimeout(() => {
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(bodyNum);
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.gotoAndStop(hatNum);
		
		setTimeout(() => { // check if hat or body has a label, if so make sure they are both active together
			let bodyLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.currentLabel;
			let hatLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.currentLabel;
			
			if (hatLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(hatLabel);
			}
		}, 100)	
		
	}, 100); 
			
	
	//FILL DATA
	let nameSplit = msgData.split(" "); //get first name only
	
		subField.getChildByName(subMC.name).banner.bannerSubBG.txtUsername.text = nameSplit[0];
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAbove.text = nameSplit[0];
		_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.txtNameAboveShadow.text = nameSplit[0];
		
	setTimeout(() => {		
		subField.getChildByName(subMC.name).banner.bannerSubDetail.txtDetails.text = "JUST BECAME A " + msgFormattedAmount + " PATRON!";
		subField.getChildByName(subMC.name).banner.bannerSubDetail.gotoAndStop("pledge");
		
	}, 100);
		
	setTimeout(() => {
		//CHOOSE BANNER (WHICH TIER)
		if (msgAmount == "1"){
			subField.getChildByName(subMC.name).banner.bannerSubBG.gotoAndStop("tier1");
		}else if (msgAmount == "4"){
			subField.getChildByName(subMC.name).banner.bannerSubBG.gotoAndStop("tier2");
		}else if (msgAmount == "10"){
			subField.getChildByName(subMC.name).banner.bannerSubBG.gotoAndStop("tier3");
		}else{
			subField.getChildByName(subMC.name).banner.bannerSubBG.gotoAndStop("tier1");
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
		
		 //create a random seed based on the user ID number
	
		// create random numbers for customization
		let bodyNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames, msgData);	
		let hatNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames, msgData);
		
		console.log("Dono: " + msgData + " | bodyNum: " + bodyNum + " | hatNum: " + hatNum);
		
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
				
				if (hatLabel){
					_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(hatLabel);
				}
			}, 100)				
			
		}, 100); 
				
		// BITS vs DONATIONS text
		if (msgType == "bits"){
			_root.MAINCONTAINER.getChildByName("charAnim").banner.txtDetails.text = "cheered " + msgAmount + " bits!";
			_root.MAINCONTAINER.getChildByName("charAnim").plusAmount.txtAmount.text = "+" + msgAmount;
		}else{
			msgAmount = Number.parseFloat(msgAmount).toFixed(2);
			_root.MAINCONTAINER.getChildByName("charAnim").banner.txtDetails.text = "tipped " + msgCurrency + " " + msgAmount +"!";
			_root.MAINCONTAINER.getChildByName("charAnim").plusAmount.txtAmount.text = "+" + msgAmount + " " + msgCurrency;
		}	
		
			
		// DIFFERENT ANIMATIONS FOR DIFFERENT AMOUNTS
		setTimeout(() => {
			/*if (trueAmount == 100) {
				_root.DONOCONTAINER.addChild(new lib.X_DONO_1());
			}else if (trueAmount == 300) {
				_root.DONOCONTAINER.addChild(new lib.X_DONO_2());
			}else if (trueAmount >= 500) {
				_root.DONOCONTAINER.addChild(new lib.X_DONO_0());;
			}else{*/
				_root.DONOCONTAINER.addChild(new lib.X_DONO_0());
			//}
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




// RAID ALERT

function raidAlert(msgData, msgRaiders){
	
	
	console.log("Starting");
	
	//SET STATUS AND DATA
	alertActive = true;
	
	waitTime = 1000;
	
	// RAIDERS CODE
	delayBetweenCallbacksPerSegment = [0.1, 0.3, 1]; // seconds
	distributionPerSegment = [0.20, 0.5, 1];  // the percentage of count to callback per segment, the last segment is assumed to be what is left over
	callbackCount = msgRaiders;
	dd = new DistributionData(callbackCount, delayBetweenCallbacksPerSegment, distributionPerSegment);

	executeCallbackDistribution(dd, spawnRaider, done);
	
	//---------------------
	
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

	 //create a random seed based on the user ID number
	
	// create random numbers for customization
	let bodyNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.totalFrames, msgData);	
	let hatNum = rngFromID(_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.totalFrames, msgData);
	
	console.log("Host: " + msgData + " | bodyNum: " + bodyNum + " | hatNum: " + hatNum);

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
		
		console.log("body: " + bodyNum + " | hat: " + hatNum);
		
		setTimeout(() => { // check if hat or body has a label, if so make sure they are both active together
			let bodyLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.currentLabel;
			let hatLabel = _root.MAINCONTAINER.getChildByName("charAnim").alertPerson.hat.currentLabel;
			
			if (hatLabel){
				_root.MAINCONTAINER.getChildByName("charAnim").alertPerson.body.gotoAndStop(hatLabel);
			}
		}, 100)	
		
		
	}, 100);

	
}

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
        )
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
  
  function spawnRaider(num){
    /* This is the point where you would spawn your Raider icon to represent someone raiding you! */
    console.log("Spawn raider here", num);
  }
  
  function done(){
    /* a callback to tell your othersystems that the raid spawning is complete, but not nessessarily that the animation is completed! */
   console.log("alldone");
  }


  console.log("Starting");

// Example on how to run this code
  delayBetweenCallbacksPerSegment = [0.1, 1, 2]; // seconds
  distributionPerSegment = [0.20, 0.5, 1];  // the percentage of count to callback per segment, the last segment is assumed to be what is left over
  callbackCount = 30;
  dd = new DistributionData(callbackCount, delayBetweenCallbacksPerSegment, distributionPerSegment);

  executeCallbackDistribution(dd, spawnRaider, done);
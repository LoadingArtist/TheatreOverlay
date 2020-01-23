that = this;

function getSong(){
	fetch('./OBSCurrentSongV1.28/currentsong.txt', {headers: NoCacheHeaders})
	.then(response => response.text())
	.then(function(currentSong){
		that.musicBox.txtSongContainer.txtSong.text = currentSong;
		let currentLabel = that.musicBox.currentLabel;
		let currentSongSliced = currentSong.slice(0,59);
		
		if(currentSong != "" & currentLabel == "off"){
			that.musicBox.gotoAndPlay("turnOn");
		}
		else if(currentSong == "" && currentLabel == "on"){
			that.musicBox.gotoAndPlay("turnOff");
		}

		//set font size depending on length of song title

		if (currentSong.length <= 35){
			that.musicBox.txtSongContainer.txtSong.font = "72px 'LoadingArtist'";
		}else if (currentSong.length <= 45){
			that.musicBox.txtSongContainer.txtSong.font = "64px 'LoadingArtist'";
		}else{
			that.musicBox.txtSongContainer.txtSong.font = "52px 'LoadingArtist'";
		}
		
		that.musicBox.txtSongContainer.txtSong.text = currentSongSliced;
			
		setTimeout(getSong, 1000);})
}

getSong();

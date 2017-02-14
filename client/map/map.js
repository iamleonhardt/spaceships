

function GameMap(){
	this.meta = null;
	this.mapData = null;
	this.domElement = null;
	this.loadedCallback = null;
	this.init = function(map, callBack,mapProperties){
		this.mapProperties = mapProperties;
		this.loadMap(map, callBack);
	}
	this.loadMap = function(map,callBack){
		this.loadedCallback = callBack;
		$.ajax({
			url: map, 
			dataType: 'json',
			success: this.mapLoaded.bind(this)
		});
	}
	this.mapLoaded = function(decodedData){
		console.log(decodedData);

		this.meta = decodedData.meta;
		this.mapData = decodedData.mapData;
		this.drawMap(this.mapProperties);
		this.loadedCallback(this.domElement);
	}
	this.drawMap = function(options){
		if(this.mapData===null){
			console.error('no map loaded');
		}
		this.domElement = $("<div>",options);
		for(var i=0; i<this.mapData; i++){
			this.domElement.append(this.mapData[i].svg);	
		}
		
	}
}
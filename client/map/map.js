

function GameMap(){
	this.meta = null;
	this.mapData = null;
	this.domElement = null;
	this.loadedCallback = null;
	this.objects = [];
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
	this.checkCollision = function(){

	}
	this.drawMap = function(options){
		if(this.mapData===null){
			console.error('no map loaded');
		}
		this.domElement = $("<div>",options);
		for(var i=0; i<this.mapData.length; i++){
			var mapObject = new MapObjectTemplate(this);
			var svg = mapObject.createElement(this.mapData[i].coords, this.mapData[i].svg);

			this.domElement.append(svg);	
		}
	}

	function MapObjectTemplate(parent){
		this.domElement = null;
		this.parent = parent;
	}
	MapObjectTemplate.prototype.createElement = function(coords, svgData){
		var svg = $(svgData);
		//svg[0].addEventListener("DOMContentLoaded",this.domElementLoaded.bind(this));
		svg.css({
			position: 'absolute',
			left: coords.x+'px',
			top: coords.y+'px'
		});
		return svg;
	}
	MapObjectTemplate.prototype.domElementLoaded = function(){
		console.log('test');
	}
	MapObjectTemplate.prototype.checkCollision = function(){

	}
}
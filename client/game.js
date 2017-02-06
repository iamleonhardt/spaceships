function GameController(socket){
    this.shipList = {};
    this.mapController = null;

    this.init = function(gameAreaSelector){
        this.gameArea = $(gameAreaSelector);
        this.instantiateMap(this.handleMapLoad.bind(this));
    };

    this.makeShip = function(initPack){
        console.log('putting together new ship');
        var ship = new Ship(initPack);
        this.shipObj = ship;
        console.log('this.shipObj is : ', this.shipObj);
        var shipDomElem = this.shipObj.createDomElem();
        console.log('shipDomElem is : ', shipDomElem);
        this.gameArea.append(shipDomElem);
        this.shipList[initPack.id] = ship;
        console.log('shipList is : ', this.shipList);

        game.shipList[this.id] = this.shipObj;
        console.log('game.shipList is : ', game.shipList);
    }
    this.instantiateMap = function(mapLoadedHandler,options){
        if(options===undefined){
            options = {id:'mapArea',class:'map'};
        }
        this.mapController = new GameMap();
        this.mapController.init('map/data/map1.json',mapLoadedHandler,options);
    }
    this.handleMapLoad = function(mapElement){
        console.log('map is loaded');
        this.gameArea.append(mapElement);
    }
}
function GameController(socket){
    var self = this;
    this.shipList = {};
    this.mapController = null;

    this.init = function(gameAreaSelector){
        this.gameArea = $(gameAreaSelector);
        this.instantiateMap(this.handleMapLoad.bind(this));
    };

    this.makeShip = function(initPack){
        // console.log('putting together new ship');
        var ship = new Ship(initPack);
        this.shipObj = ship;
        var shipDomElem = this.shipObj.createDomElem();
        this.gameArea.append(shipDomElem);
        this.shipList[initPack.id] = ship;
        // game.shipList[initPack.id] = this.shipObj;
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
    this.handle_keypress = function (e) {
        // console.log(selfId);
        switch (e.which) {
            case 119: //thrust pressed
                console.log('thrust pressed');
                self.shipList[selfId].move_ship();
                // _this.player_mobile.thrust();
                break;
            case 100: //turn right
                console.log('turn right pressed');
                self.shipList[selfId].rotateRight();
                //event "this" redeclaration workaround #1
                //_this.player_mobile.turn();
                //event "this" redeclaration workaround #2, see //REDEC WORKAROUND #2 for more details
                // _this.player_mobile.turn(1);

                break;
            case 115: //brake pressed, not currently used
                console.log('brake pressed');
                break;
            case 97: //turn left pressed
                console.log('turn left pressed');
                self.shipList[selfId].rotateLeft();
                // _this.player_mobile.turn(-1);
                break;
            default:
                console.log('something else pressed');
                break;

        }
    }
    this.handle_keyup = function (e) {
        switch (e.which) {
            case 87: //thrust pressed
                console.log('thrust keyup');
                // this.player_mobile.stop_thrust();
                break;
            case 65:
            case 68:
                console.log('turn keyup');
                // this.player_mobile.stop_turn();
            default:
                console.log('something else keyup' + e.which);
        }
    }
}
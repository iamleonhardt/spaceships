function GameController(socket) {
    var self = this;
    this.shipList = {};
    this.mapController = null;

    this.init = function (gameAreaSelector) {
        this.gameArea = $(gameAreaSelector);
        this.instantiateMap(this.handleMapLoad.bind(this));
        this.addTeamClickHandlers();
        $('.shipChoice').click(this.shipSelected);

    };

    this.addTeamClickHandlers = function(){
        $('#Red').click(self.showTeamShips);
        $('#Green').click(self.showTeamShips);
        $('#Gold').click(self.showTeamShips);
    };

    this.showTeamShips = function (){
        var color = $(this).attr('id');
        console.log('team was clicked and this is : ', this);
        $('#selectShipText').text('Select a Ship');
        $('#shipChoice1').attr('class', 'shipChoice ship' + color + '1');
        $('#shipChoice2').attr('class', 'shipChoice ship' + color + '2');
        $('#shipChoice3').attr('class', 'shipChoice ship' + color + '3');
        $('#shipChoice4').attr('class', 'shipChoice ship' + color + '4');
        $('#shipChoice5').attr('class', 'shipChoice ship' + color + '5');
        $('#shipChoice6').attr('class', 'shipChoice ship' + color + '6');
        $('#shipChoice7').attr('class', 'shipChoice ship' + color + '7');
    };

    this.shipSelected = function(){
      //store value
        console.log('click and this is : ', this);
        $(this).attr('style', 'box-shadow:  0 0 5px 1px #fff')
    };

    this.instantiateMap = function (mapLoadedHandler, options) {
        if (options === undefined) {
            options = { id: 'mapArea', class: 'map' };
        }
        this.mapController = new GameMap();
        this.mapController.init('map/data/map1.json', mapLoadedHandler, options);
    }
    this.handleMapLoad = function (mapElement) {
        console.log('map is loaded');
        this.gameArea.append(mapElement);
    }

    this.makeShip = function (initPack) {
        // console.log('putting together new ship');
        var ship = new Ship(initPack);
        this.shipObj = ship;
        var shipDomElem = this.shipObj.createDomElem();
        this.gameArea.append(shipDomElem);
        this.shipList[initPack.id] = ship;
        // game.shipList[initPack.id] = this.shipObj;
    }
}
function GameController(socket) {
    this.shipList = {};
    this.bulletList = {};
    this.mapController = null;

    this.init = function (gameAreaSelector) {
        this.gameArea = $(gameAreaSelector);
        this.instantiateMap(this.handleMapLoad.bind(this));
    };

    this.makeShip = function (initPack) {
        // console.log('putting together new ship');
        var ship = new Ship(initPack);
        this.shipObj = ship;
        var shipDomElem = this.shipObj.createDomElem();
        this.gameArea.append(shipDomElem);
        this.shipList[initPack.id] = ship;
        // game.shipList[initPack.id] = this.shipObj;
    }
    this.createBullet = function (data) {
        var shot = new Bullet(data);
        var bang = shot.createDomElem();
        this.gameArea.append(bang);
        this.bulletList[shot.id] = shot;
    }
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
}
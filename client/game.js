function GameController(socket){
    this.shipList = {};

    this.init = function(gameAreaSelector){
        this.gameArea = $(gameAreaSelector);
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
}
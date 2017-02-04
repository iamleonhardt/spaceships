
function GameController(socket){
    this.shipList = {};

    this.init = function(gameAreaSelector){
        this.gameArea = $(gameAreaSelector);
    }

    this.makeShip = function(socket){
        console.log('putting together new ship');
        var ship = new Ship();
        this.shipObj = ship;
        console.log('this.shipObj is : ', this.shipObj);
        var shipDomElem = this.shipObj.createDomElem();
        console.log('shipDomElem is : ', shipDomElem);
        this.gameArea.append(shipDomElem);
        this.shipList[socket.id] = ship;
        console.log('shipList is : ', this.shipList);
    }
}


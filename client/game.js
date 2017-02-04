
function GameController(){
    this.shipList = {};

    this.init = function(gameAreaSelector){
        this.gameArea = $(gameAreaSelector);
        this.makeShip();
    }

    this.makeShip = function(socket){
        var ship = new Ship();
        this.shipObj = ship;
        var shipDomElem = this.shipObj.createDomElem();
        $('#gameArea').append(shipDomElem);
        this.shipList[socket.id] = ship;
    }
}


function Ship(initPack) {
    var self = this;
    this.id = initPack.id;
    this.pilotName = initPack.pilotName;
    this.bullets = initPack.bullets;
    this.health = 50;
    this.width = 30;
    this.height = 30;
    // this.shipSprite = 'shipRed' + getRanNum(1,7);
    this.team = initPack.team;
    this.shipSprite = initPack.ship;
    console.log('selected ship is : ', initPack);


    this.domElem = null;


    // location and movement properties
    this.x = initPack.x;
    this.y = initPack.y;
    this.xTraj = 0;
    this.yTraj = 0;
    this.speed = initPack.speed;
    this.rotation = 0;

    this.createDomElem = function () {
        this.domElem = $('<div>', {
            id: this.id,
            class: 'ship ' + this.shipSprite,
            css: {
                left: self.x,
                top: self.y,
                'transition-duration': 20 + 'ms',
                // 'background-color': initPack.shipColor,
                // width: self.width + 'px',
                // height: self.height + 'px',
            }
        });
        var nameDiv = $('<div>', {
                id: 'pilotName',
                text: this.pilotName
            }
        );
        this.domElem.append(nameDiv);
        return this.domElem;
    };

    this.shipDie = function () {
        console.log('destroying ship... kapow');
        $(this.domElem).remove();

    }
}
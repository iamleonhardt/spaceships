function Ship(initPack) {
    var self = this;
    this.id = initPack.id;
    this.pilotName = initPack.pilotName;
    this.bullets = initPack.bullets;

    this.width = 30;
    this.height = 30;
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
            class: 'ship',
            css: {
                left: self.x,
                top: self.y,
                'transition-duration': 0.1 + 's',
                // 'background-color': initPack.shipColor,
                // width: self.width + 'px',
                // height: self.height + 'px',
                text: this.pilotName
            }
        });
        return this.domElem;
    };

    this.shootBullet = function(shot){
        
    }

    this.createBullet = function(){
        if (self.bullets > 0){
            var shot = new Bullet(game.shipList[selfId]);
            var bang = shot.createDomElem();
            game.gameArea.append(bang);
            game.bulletList[shot.id] = shot;
            self.shootBullet(shot);
                        
        }
    }

    this.shipDie = function () {
        console.log('destroying ship... kapow');
        $(this.domElem).remove();

    }
}
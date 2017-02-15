function Bullet(data){
    var self = this;
    this.id = data.id;
    this.parent = 0;
    this.domElem = null;


    this.createDomElem = function () {
        this.domElem = $('<div>', {
            id: this.id,
            class: 'bullet',
            css: {
                left: data.x,
                top: data.y,
                'transition-duration': 0.1 + 's',
                height: 1 + 'px',
                width: 1 + 'px'

            }
        });
        return this.domElem;
    };

    // this.shootBullet = function () {
    //     var temp_angle = self.trajectory + 280;
    //     var delta_x = Math.cos(self.get_radians(temp_angle)) * self.speed;
    //     var delta_y = Math.sin(self.get_radians(temp_angle)) * self.speed;
    //     console.log()
    //     // self.x += delta_x;
    //     // self.y += delta_y;
    //     self.domElem.css({
    //         top : '+='+delta_y+'px',
    //         left : '+='+delta_x+'px'
    //     })
    // }
    this.bulletDie = function () {
        console.log('removing bullet');
        $(this.domElem).remove();

    }

    setTimeout(function(){
        delete game.bulletList[self.id];
        self.bulletDie();
    }, 3000)

    this.get_radians = function (degrees) {
        return (Math.PI / 180) * degrees;
    }

}

    
function Bullet(parent){
    var self = this;
    this.parent = parent;
    this.domElem = null;

    this.x = parent.x;
    this.y = parent.y;
    this.speed = 50;
    this.trajectory = parent.rotation;

    this.createDomElem = function () {
        this.domElem = $('<div>', {
            id: this.id,
            class: 'bullet',
            css: {
                left: self.x,
                top: self.y,
                'transition-duration': 0.1 + 's',
                height:1 + 'px',
                width:1 + 'px'

            }
        });
        return this.domElem;
    };

    this.shootBullet = function () {
        var temp_angle = self.trajectory + 280;
        var delta_x = Math.cos(self.get_radians(temp_angle)) * self.speed;
        var delta_y = Math.sin(self.get_radians(temp_angle)) * self.speed;
        console.log()
        // self.x += delta_x;
        // self.y += delta_y;
        self.domElem.css({
            top : '+='+delta_y+'px',
            left : '+='+delta_x+'px'
        })
    }

    this.get_radians = function (degrees) {
        return (Math.PI / 180) * degrees;
    }

}

    this.bulletDie = function () {
        console.log('destroying ship... kapow');
        $(this.domElem).remove();

    }
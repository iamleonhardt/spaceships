function Bullet(data) {
    var self = this;
    this.id = data.id;
    this.parent = 0;
    this.domElem = null;
    this.x = data.x;
    this.y = data.y;


    this.createDomElem = function () {
        this.domElem = $('<div>', {
            id: self.id,
            class: 'bullet',
            css: {
                left: self.x,
                top: self.y,
                'transition-duration': 0.1 + 's',
                height: 1 + 'px',
                width: 1 + 'px'

            }
        });
        return this.domElem;
    };

    this.bulletDie = function () {
        // console.log('removing bullet');
        $(this.domElem).remove();

    }

    //self death built into the bullet
    setTimeout(function () {
        delete game.bulletList[self.id];
        self.bulletDie();
    }, 1000)

    this.get_radians = function (degrees) {
        return (Math.PI / 180) * degrees;
    }

}


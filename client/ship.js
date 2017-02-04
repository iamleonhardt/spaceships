function Ship(initPack){
    var self = this;
    this.id = initPack.id;

    this.x = initPack.x;
    this.y = initPack.y;

    this.domElem = null;

    this.createDomElem = function(){
        this.domElem = $('<div>', {
            id: 'ship',
            class: 'ship',
            css: {
                left: self.x,
                top: self.y,
                width: self.width + 'px',
                height: self.height + 'px'
            }
        });
        return this.domElem;
    };

}

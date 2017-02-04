function Ship(){
    this.x = 0;
    this.y = 0;
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
    }

}

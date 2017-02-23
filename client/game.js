function GameController(socket) {
    var self = this;
    this.shipList = {};
    this.bulletList = {};
    this.mapController = null;
    this.selectedTeam = '';
    this.selectedShip = '';
    this.pilotName = '';

    this.init = function (gameAreaSelector) {
        this.gameArea = $(gameAreaSelector);
        this.instantiateMap(this.handleMapLoad.bind(this));
        this.addTeamSelectMenuClickHandlers();

    };

    // Select Ship Menu
    this.addTeamSelectMenuClickHandlers = function () {
        $('#Red').click(self.teamSelected);
        $('#Green').click(self.teamSelected);
        $('#Gold').click(self.teamSelected);

        $('.shipChoice').click(this.shipSelected);
        $('#joinBtn').click(self.joinTheFightBtn);
    };

    this.teamSelected = function () {
        var color = $(this).attr('id');
        console.log('team was clicked and this is : ', this);
        // Store team choice
        self.selectedTeam = $(this).attr('id');
        $('#menuInstructions').text('Select a Ship');
        // Show ships for team and add data-value
        for (var i = 1; i < 8; i++) {
            $('#shipChoice' + i).attr({
                'data-ship-sprite': 'ship' + color + i,
                class: 'shipChoice ship' + color + i
            });
        }
    };

    this.shipSelected = function () {
        //store ship choice
        self.selectedShip = this.dataset.shipSprite;
        console.log('data is : ', this.dataset.shipSprite);
        console.log('click and this is : ', this);
        $('.shipChoice').removeClass('selectedShip');
        $(this).addClass('selectedShip');
    };

    this.pilotNameInput = function () {
        self.pilotName = $('#pilotNameInput').val();
        if (self.pilotName == '') {
            self.pilotName = 'Drone';
        }
    };

    this.joinTheFightBtn = function () {
        if (self.selectedTeam == '') {
            $('#menuInstructions').text('Please Select a Team First');
        } else if (self.selectedShip == '') {
            $('#menuInstructions').text('Please Select a Ship First');

        } else {
            self.pilotNameInput();
            var joinPack = {
                pilotName: self.pilotName,
                selectedTeam: self.selectedTeam,
                selectedShip: self.selectedShip
            }
            // Pass the info to the server to make the ship
            socket.emit('joinTheFight', joinPack);
            $('#chooseTeamDiv').hide();
            game.addEventHandlers();

            //used to follow the players ship around
            setInterval(function () {
                window.scrollTo(game.shipList[selfId].x - 400, game.shipList[selfId].y - 400);
            }, 5);
        }
    };

    // Make Ship
    this.makeShip = function (initPack) {
        // console.log('putting together new ship');
        var ship = new Ship(initPack);
        this.shipObj = ship;
        var shipDomElem = this.shipObj.createDomElem();
        this.gameArea.append(shipDomElem);
        this.shipList[initPack.id] = ship;
        // game.shipList[initPack.id] = this.shipObj;
    }
    this.createBullet = function (data) {
        var shot = new Bullet(data);
        var bang = shot.createDomElem();
        this.gameArea.append(bang);
        this.bulletList[shot.id] = shot;
    }
    this.instantiateMap = function (mapLoadedHandler, options) {
        if (options === undefined) {
            options = { id: 'mapArea', class: 'map' };
        }
        this.mapController = new GameMap();
        this.mapController.init('map/data/map1.json', mapLoadedHandler, options);
    };
    this.handleMapLoad = function (mapElement) {
        console.log('map is loaded');
        this.gameArea.append(mapElement);
    };


    this.handleKeypress = function (e) {
        console.log('keypress, e is : ', e.which);
        switch (e.which) {
            case 87: // w
                socket.emit('keyPress', { inputId: 'up', state: true });
                break;
            case 65: // a
                socket.emit('keyPress', { inputId: 'left', state: true });
                break;
            case 83: // s
                socket.emit('keyPress', { inputId: 'down', state: true });
                break;
            case 68:  // d
                socket.emit('keyPress', { inputId: 'right', state: true });
                break;
            case 32:  // spacebar
                socket.emit('keyPress', { inputId: 'space', state: true });
        }
    }


    this.handleKeyup = function (e) {
        console.log('keyup, e is : ', e.which);
        switch (e.which) {
            case 87: // w
                socket.emit('keyPress', { inputId: 'up', state: false });
                break;
            case 65: // a
                socket.emit('keyPress', { inputId: 'left', state: false });
                break;
            case 83: // s
                socket.emit('keyPress', { inputId: 'down', state: false });
                break;
            case 68:  // d
                socket.emit('keyPress', { inputId: 'right', state: false });
                break;
            case 32:  // spacebar
                socket.emit('keyPress', { inputId: 'space', state: false });
        }
    }

    this.shipUpdate = function () {
        for (var i in game.shipList) {

            // update position
            var ship = game.shipList[i];
            //    console.log('ship is : ', ship);
            ship.domElem.css({
                left: ship.x + 'px',
                top: ship.y + 'px',
                transform: 'rotateZ(' + ship.rotation + 'deg)'
            });
        }
    }

    this.bulletUpdate = function () {
        for (var i in game.bulletList) {
            var shot = game.bulletList[i];
            shot.domElem.css({
                left: shot.x + 'px',
                top: shot.y + 'px'
            })
        }
    }

    this.addEventHandlers = function () {
        $(document).keydown(game.handleKeypress);
        $(document).keyup(game.handleKeyup);
    }
}
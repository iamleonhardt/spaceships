function GameController(socket) {
    var self = this;
    this.shipList = {};
    this.mapController = null;
    this.selectedTeam = '';
    this.selectedShip = '';

    this.init = function (gameAreaSelector) {
        this.gameArea = $(gameAreaSelector);
        this.instantiateMap(this.handleMapLoad.bind(this));
        this.addTeamSelectMenuClickHandlers();

    };

    this.addTeamSelectMenuClickHandlers = function(){
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

    this.shipSelected = function(){
      //store ship choice
        self.selectedShip = this.dataset.shipSprite;
        console.log('data is : ', this.dataset.shipSprite);
        console.log('click and this is : ', this);
        $('.shipChoice').removeClass('selectedShip');
        $(this).addClass('selectedShip');
    };

    this.joinTheFightBtn = function(){
        var pilotName = $('#pilotNameInput').val();
        if (self.selectedTeam == ''){
            $('#menuInstructions').text('Please Select a Team First');
        }else if (self.selectedShip == ''){
            $('#menuInstructions').text('Please Select a Ship First');

        }else{
            // Make ship with (self.selectedTeam, self.selectedShip, pilotName)
            if(pilotName == ''){
                pilotName = 'Drone';
            }
            // Pass the info to the server to make the ship
            $('#chooseTeamDiv').hide();
        }
    };

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

    this.makeShip = function (initPack) {
        // console.log('putting together new ship');
        var ship = new Ship(initPack);
        this.shipObj = ship;
        var shipDomElem = this.shipObj.createDomElem();
        this.gameArea.append(shipDomElem);
        this.shipList[initPack.id] = ship;
        // game.shipList[initPack.id] = this.shipObj;
    }
}
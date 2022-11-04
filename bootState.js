var bootState = {
    preload : function(){

        //Load Start button
        game.load.image('startBtn','assets/startBtn.png');
        //Load the background        
        game.load.image ('bkg_sky','assets/sky.jpg');

    },
    create: function(){
        
        game.add.image(0,0, 'bkg_sky')

        //Messages
        game.add.text(70, 140, " Floppy Bird", 
        { font: "50px Lobster", fill: "#ffa500" });

        game.add.text(70, 210, " Press SPACEBAR to START", 
        { font: "30px Russo One", fill: "#ffa500" });

        // Call main
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);  
        

    },
    update: function(){


    },
    startGame : function(){
        game.state.start('main');

    },

}
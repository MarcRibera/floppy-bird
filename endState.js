var endState ={
    preload: function(){

    },
    create :function (){
        game.add.image(0,0, 'bkg_sky')
        //Messages
        this.msg = game.add.text(70, 140, " GAME OVER!", 
        { font: "30px Russo One", fill: "#ffa500" });
        
        this.FinalScore = game.add.text(75, 180, 'Final Score: '+ Score, 
        { font: "30px Lobster", fill: "#ffffff" });

        game.add.text(70, 240, " Press SPACEBAR to RESTART", 
        { font: "30px Russo One", fill: "#ffa500" });

        
     
        // Call main
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startGame, this);  
    },
    update: function(){

    },
    
    startGame : function(){
        game.state.start('boot') ;

    },

}
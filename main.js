
// Global Variables
var Score;

// Create our 'main' state that will contain the game
var mainState = {
    preload: function() { 
        // This function will be executed at the beginning     
        // That's where we load the images and sounds 

        // Load the bird sprite
        game.load.image('bird', 'assets/bird4.png'); 

        //Load the pipe
        game.load.image('pipe','assets/wall2.png');

        //Load the background        
        game.load.image ('bkg_sky','assets/sky.jpg');

        //Load Game Sounds
        game.load.audio('jump', 'assets/jump.wav'); 
        game.load.audio('hit', 'assets/hit.mp3'); 
        game.load.audio('musicGame', 'assets/music_mp3.mp3')


    },

    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc.
        var hitTimeCheck;

        
        // Display background 
        game.add.image(0, 54, 'bkg_sky')

        // Display the bird at the position x=100 and y=245
        this.bird = game.add.sprite(100, 245, 'bird');

        // Create an empty group of pipes
        this.pipes = game.add.group();

        this.pipeVel=-300; 

        //Add sounds in the game
        this.jumpSound = game.add.audio('jump'); 
        this.hitSound = game.add.audio('hit'); 
        this.musicGame=game.add.audio('musicGame');
        this.musicGame.loopFull();        
        
        // Set the physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Add physics to the bird
        // Needed for: movements, gravity, collisions, etc.
        game.physics.arcade.enable(this.bird);

        // Add Bounce to bird
        this.bird.body.collideWorldBounds = true;
        this.bird.body.bounce.set(0.7);

        // Add gravity to the bird to make it fall
        this.bird.body.gravity.y = 1600;  

        // Call the 'jump' function when the spacekey is hit
        var spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);     
        
        //Timer
        this.timerPipe = game.time.events.loop(1500, this.addRowOfPipes, this);
        this.addRowOfPipes();

        //Messages
        this.msg = game.add.text(350, 5, " Low Velocity", 
        { font: "33px Lobster", fill: "#088A08" });
        
        //Score
        Score = 0;
        this.labelScore = game.add.text(114, 12, "0", 
        { font: "27px Russo One", fill: "#ffffff" });

        game.add.text(30, 13, "score: ", 
        { font: "25px Russo One", fill: "#ffffff" });

        // Score +1 when newRowOfPipes it's creatd, (every 1500ms)
        this.timerScore = game.time.events.loop(1550, this.addScore, this);

     },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic

        // If the bird is out of the screen (too high or too low)
        // Call the 'restartGame' function
        switch  (Score){
            case 10 :
            console.log("vel medium");
            this.msg.text = "Medium velocity";
            this.msg.fill = "#DF7401";
            this.timerPipe.delay = 1350;
            this.timerScore.delay = 1350;
             break; 
            case 20 :
            console.log("vel fast");
            this.msg.text = "!Fast velocity!";
            this.msg.fill = "#DF0101";

            this.timerPipe.delay = 1100;
            this.timerScore.delay = 1150;
             break;
             
             case 35 :
            console.log("delay extra fast");
            this.msg.text = "!!Insane Velocity!!";
            this.msg.fill = "#DF01D7";
            this.timerPipe.delay= 950;
            this.timerScore.delay =1300;
             break;

            case 37 :
            this.timerScore.delay =950;
             break;            
        }        
       
        if (game.time.now - this.hitTimeCheck > 1700) {game.state.start('boot');};

        //IF collision restar the game
         game.physics.arcade.overlap(
        this.bird, this.pipes, this.hitPipe, null, this)   
        
        //Message
        if (this.bird.angle < 20)
        this.bird.angle += 1;   
    },
    // Make the bird jump 
    jump: function() {
       
         // If hit pipe, bird can't jump
        if (this.bird.alive == false)
            return;  
        
        // Add a vertical velocity to the bird
        this.bird.body.velocity.y = -500;

        // Create an animation on the bird
        var animation = game.add.tween(this.bird);
        // Change the angle of the bird to -20° in 100 milliseconds
        animation.to({angle: -20}, 100);
        // And start the animation
        animation.start();

        this.jumpSound.play(); 

     },

    // Restart the game
    restartGame: function() {
        // Start the 'main' state, which restarts the game
        game.state.start('main');
    },

    addOnePipe: function(x, y) {

        // Create a pipe at the position x and y
        var pipe = game.add.sprite(x, y+50, 'pipe');

        // Add the pipe to our previously created group
        this.pipes.add(pipe);

        // Enable physics on the pipe 
        game.physics.arcade.enable(pipe);

        // Add velocity to the pipe to make it move left
        pipe.body.velocity.x = this.pipeVel; 

        // Automatically kill the pipe when it's no longer visible 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;

    },
    addRowOfPipes: function() {

        // Randomly pick a number between 1 and 5
        // This will be the hole position
        var hole = Math.floor(Math.random() * 7) + 1;
        // Add the 6 pipes 
        // With one big hole at position 'hole' and 'hole + 1'
        for (var i = 0; i < 10; i++)
            if (i != hole && i != hole + 1 && i != hole - 1) 
                this.addOnePipe(600, i * 50 + 10);
    },
    hitPipe: function() {
        // If the bird has already hit a pipe, do nothing
        // It means the bird is already falling off the screen
        if (this.bird.alive == false)
            return;

        this.hitSound.play();
        this.musicGame.pause(); 

        // Set the alive property of the bird to false
        this.bird.alive = false;

        // Prevent new pipes from appearing
        game.time.events.remove(this.timerPipe);

        // Go through all the pipes, and stop their movement
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
        
      
        //TimeOut 1.7 seconds to execute toBoot, toBoot Might be a function
        // not a Method
        game.time.events.add(1700, toEnd , this);
        
    },
    addScore: function(){           
        Score += 1;
        this.labelScore.text = Score;

    }, 
};

function toEnd (){
        game.state.start('end');

}



// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(600,540);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState); 
game.state.add('boot', bootState); 
game.state.add('end', endState); 

// Start the state to actually start the game
game.state.start('boot');

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 640,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: false
        }
    }
}

const game = new Phaser.Game(config);

let player, ball, redCrane32s, redCrane64s, greenCandles, redCandles, beromes, pelosis, terrys, cursors, heart;

let lives = 2;

let gameStarted = false;

let openingText, gameOverText, playerWonText, ballHitsText, battleCranesText, healthText;

let bg;

let userSolAddress;

let currentRound = 0;

const rounds = [
    function(physics) {
        redCrane32s = physics.add.group({})
         redCrane64s = physics.add.group({})
         greenCandles = physics.add.group({})
         redCandles = physics.add.group({})
         terrys = physics.add.group({})
         pelosis = physics.add.group({})
         beromes = physics.add.group({})
        redCrane32s = physics.add.group({
            key: 'redCrane32',
            repeat: 0,
            immovable: true,
            setXY: {
                x: 180,
                y: 140,
                stepX: 50
            }
        })
        redCrane64s = physics.add.group({
            key: 'redCrane64',
            repeat: 0,
            immovable: true,
            setXY: {
                x: 100,
                y: 190,
                stepX: 70
            }
        })
        greenCandles, redCandles, terrys, pelosis, beromes = physics.add.group({})
    },
    function(physics) {
        redCrane32s = physics.add.group({
            key: 'redCrane32',
            repeat: 0,
            immovable: true,
            setXY: {
                x: 290,
                y: 250,
                stepX: 50
            }
        })
        greenCandles = physics.add.group({
            key: 'greenCandle',
            repeat: 0,
            immovable: true,
            setXY: {
                x: 180,
                y: 140,
                stepX: 50
            }
        })
        redCandles = physics.add.group({
            key: 'redCandle',
            repeat: 0,
            immovable: true,
            setXY: {
                x: 100,
                y: 190,
                stepX: 70
            }
        })
    },
    function(physics) {
        pelosis = physics.add.group({
            key: 'pelosi',
            repeat: 5,
            immovable: true,
            setXY: {
                x: 290,
                y: 250,
                stepX: 50
            }
        })
        beromes = physics.add.group({
            key: 'berome',
            repeat: 9,
            immovable: true,
            setXY: {
                x: 180,
                y: 140,
                stepX: 50
            }
        })
        terrys = physics.add.group({
            key: 'terry',
            repeat: 9,
            immovable: true,
            setXY: {
                x: 100,
                y: 190,
                stepX: 70
            }
        })
    },
    
]
function preload() {
    // bgs
    this.load.image('bg0', 'assets/images/bg0.png');
    this.load.image('bg1', 'assets/images/bg1.png');
    this.load.image('bg2', 'assets/images/bg2.png');
    this.load.image('bg3', 'assets/images/bg3.png');

    // bricks
    this.load.image('redCrane32', 'assets/images/redcrane_32_32.png');
    this.load.image('redCrane64', 'assets/images/redcrane_64_64.png');
    this.load.image('greenCandle', 'assets/images/green-candles.png');
    this.load.image('redCandle', 'assets/images/red-candles.png');
    this.load.image('berome', 'assets/images/berome_dowell.png');
    this.load.image('pelosi', 'assets/images/pancy-jelosi.png');
    this.load.image('terry', 'assets/images/terry-tensler.png');

    this.load.image('ball', 'assets/images/solana-circle.png');
    this.load.image('panda', 'assets/images/panda.png');
    this.load.image('heart', 'assets/images/heart.png')
    this.load.image('heartCracked', 'assets/images/heart-cracked.png');

    // audio
    this.load.audio('crystalmall', "assets/audio/crystalmall.mp3");
    this.load.audio('ballHit', "assets/audio/ballhit.wav")
    this.load.audio('brickHit', "assets/audio/brickhit.wav")
    this.load.audio('wassup', "assets/audio/wassuppandas.mp3");
    this.load.audio('lfg', "assets/audio/lfg.mp3");
}

function create() {
    bg = this.add.image(500, 640, 'bg0');
    bg.setAlpha(0.3);

    player = this.physics.add.sprite(
        400, 600,
        'panda'
    )

    player.setScale(0.05);

    ball = this.physics.add.sprite(
        400, 540,
        'ball'
    )

    heart = this.physics.add.sprite(30, 30, 'heart')


    rounds[0](this.physics);

    cursors = this.input.keyboard.createCursorKeys();

    player.setCollideWorldBounds(true);
    ball.setCollideWorldBounds(true);

    ball.setBounce(1,1);

    this.physics.world.checkCollision.down = false;

    this.physics.add.collider(ball, redCrane32s, hitBrick, null, this);
    this.physics.add.collider(ball, redCrane64s, hitBrick, null, this);

    player.setImmovable(true);

    this.physics.add.collider(ball, player, hitPlayer, null, this);

    openingText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        ['The object of the game is to battle the cranes.',
         'The winner is Panda who battles them with the least amount of hits to their ball.',
         'Press SPACE to Start.',
         'also: battle cranes'
     ],
        {
          fontFamily: 'Monaco, Courier, monospace',
          fontSize: '15px',
          fill: '#fff'
        },
      );
    openingText.setOrigin(0.5);

    battleCranesText = this.add.text(
        this.physics.world.bounds.width / 2,
       30,
        'Battle Cranes',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#fff'
          },
    )
    battleCranesText.setOrigin(0.5);

    ballHitsText = this.add.text(
        this.physics.world.bounds.width - 50,
       25,
        "Score: " + numberOfBallHits,
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '20px',
            fill: '#fff'
          },
    )
    ballHitsText.setOrigin(0.5);
    ballHitsText.setVisible(false);

    gameOverText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Ya lost! Replay?',
        {
          fontFamily: 'Monaco, Courier, monospace',
          fontSize: '25px',
          fill: '#fff'
        },
      );

      heartText = this.add.text(
        70,
        30,
        ":" +lives,
        {
          fontFamily: 'Monaco, Courier, monospace',
          fontSize: '30px',
          fill: '#fff'
        },
      );
      heartText.setOrigin(0);

      heart.setVisible(false);
    heartText.setVisible(false);

gameOverText.setOrigin(0.5);

// Make it invisible until the player loses
gameOverText.setVisible(false);

// Create the game won text
playerWonText = this.add.text(
  this.physics.world.bounds.width / 2,
  this.physics.world.bounds.height / 2,
  'You won!',
  {
    fontFamily: 'Monaco, Courier, monospace',
    fontSize: '50px',
    fill: '#fff'
  },
);

    playerWonText.setOrigin(0.5);

    // Make it invisible until the player wins
    playerWonText.setVisible(false);
}

function update() {
    if(isOutOfBounds(this.physics.world)) {
        ball.setX(player.x);
        ball.setY(540);
        if(lives != -420) {
            lives -=1;
        }
        heartText.setText(": " + lives);
        if(isGameOver()) {
            heart.setTexture("heartCracked");
            gameOverText.setVisible(true, true);
            ball.disableBody(true, true);
        }
    }
     else if (isRoundOver()) {
         if(isWon()) {
            leaderboard.push(score);
            playerWonText.setVisible(true);
            ball.disableBody(true, true);
         } else {
            const next = rounds[currentRound+1];
            if(next) {
                next(this.physics);
                currentRound++;
                this.physics.add.collider(ball, redCrane32s, hitBrick, null, this);
                this.physics.add.collider(ball, redCrane64s, hitBrick, null, this);
                this.physics.add.collider(ball, greenCandles, hitBrick, null, this);
                this.physics.add.collider(ball, redCandles, hitBrick, null, this);
                this.physics.add.collider(ball, terrys, hitBrick, null, this);
                this.physics.add.collider(ball, beromes, hitBrick, null, this);
                this.physics.add.collider(ball, pelosis, hitBrick, null, this);
                // bg.setTexture("bg"+currentRound);
                // bg.setAlpha(0.3);
            }
         }
    } else {
    // todo logic for regular game time
        handleCursors(this.sound);
    }
}

let numberOfBallHits = 0;

function hitPlayer() {
    this.sound.play("ballHit");
    numberOfBallHits++;
    ballHitsText.setText("Score: " + numberOfBallHits);

    // incrase velocity after a bounce
    ball.setVelocityY(ball.body.velocity.y - 5);

    let newXVelocity = Math.abs(ball.body.velocity.x) + 5;
    // if ball is to the left, esure x is negative
    if (ball.x < player.x) {
        ball.setVelocityX(-newXVelocity);
    } else {
        ball.setVelocityX(newXVelocity);
    }
}

function hitBrick(ball, brick) {
    this.sound.play("brickHit");
    brick.disableBody(true, true);

    if (ball.body.velocity.x == 0) {
        const randNum = Math.random();
        if (randNum >= 0.5) {
            ball.body.setVelocityX(150);
        } else {
            ball.body.setVelocityX(-150);
        }
    }
}


function handleCursors(sound) {
    if(!gameStarted) {
        ball.setX(player.x);
    }

    if (cursors.space.isDown) {
        if(!gameStarted) {
            gameStarted = true;
            sound.play("lfg");
            sound.play("crystalmall");
            heart.setVisible(true);
            heartText.setVisible(true);
            ballHitsText.setVisible(true);
        
            ball.setVelocityY(-200);
            openingText.setVisible(false);
        }
      }

    player.body.setVelocityX(0);
    if (cursors.left.isDown) {
        player.body.setVelocityX(-350);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(350);
    }
}

function isGameOver() {
    return lives < 0;
}

function isOutOfBounds(world) {
    return ball.body.y > world.bounds.height;
}

function isWon() {
    return currentRound === rounds.length;
}

function isRoundOver() {
    return redCrane32s.countActive() +
      redCrane64s.countActive() +
       greenCandles.countActive() +
        redCandles.countActive() +
        pelosis.countActive() +
        terrys.countActive() +
        beromes.countActive() === 0
}
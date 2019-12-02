// globals
let platforms;
let player;
let cursors;
let score = 0;
let scoreText;
let scoreBoardTemplate = (score = 0) => `Score: ${score}`;

const WINDOW_WIDTH = 800;
const WINDOW_HEIGHT = 600;

let config = {
    type: Phaser.AUTO,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: '#59fd42',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// initialize the game here
let game = new Phaser.Game(config);

function preload () {
    // load an image over here
    this.load.image('wall', 'static/assets/wall.png');

    // load sprites
    this.load.spritesheet('homer', 'static/assets/homer.png', { frameWidth: 32, frameHeight: 70 });
}

function create () {
    // adds an image to the canvas
    // this.add.image(400, 300, 'wall');

    platforms = this.physics.add.staticGroup();
    platforms.create(200, 150, 'wall');
    platforms.create(600, 450, 'wall');
    // for scaling the object/
    // refresh body for making the physics aware about this change
    platforms.create(650, 50, 'wall').setScale(0.5, 1).refreshBody();

    player = this.physics.add.sprite(100, 450, 'homer');
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('homer', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'homer', frame: 4 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('homer', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    // for scores
    scoreText = this.add.text(WINDOW_WIDTH/3, WINDOW_HEIGHT - 50, scoreBoardTemplate(0), { fontSize: '32px', fill: '#fff' });
}

function update () {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-160);
    } else if (cursors.down.isDown) {
        player.setVelocityY(160);
    } else {
        player.setVelocityY(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

// function to update the text score
function updateScore (score) {
    scoreText.setText(scoreBoardTemplate(score));
}
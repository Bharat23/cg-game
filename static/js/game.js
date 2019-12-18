// globals
let platforms;
let player;
let enemy;
let cursors;
let score = 0;
let scoreText;
let bullets;
var fireRate = 100;
var nextFire = 0;
let isFired = false;
let lastDirection = 'down';
const bulletVelocity = 300;
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
    this.load.image('snow', 'static/assets/snow-back.jpg');
    this.load.image('snowtrees', 'static/assets/snowtrees.png');
    // load the bullet
    this.load.image('snowball', 'static/assets/snowball.png');

    // load sprites
    this.load.spritesheet('walker', 'static/assets/walker.png', { frameWidth: 65, frameHeight: 63 });
    this.load.spritesheet('walkerShooting', 'static/assets/walker_shooting.png', { frameWidth: 65, frameHeight: 63 });
    this.load.spritesheet('enemy', 'static/assets/ogre.png', { frameWidth: 65, frameHeight: 64 });
}

function create () {
    // adds an image to the canvas
    this.add.image(200, 200, 'snow').setScale(3);

    // create the map
    platforms = this.physics.add.staticGroup();
    generateTreeBarriers(600, 50, 10, horizontal = true);
    generateTreeBarriers(400, 450, 14, horizontal = true);
    generateTreeBarriers(150, 0, 10, horizontal = false);

    // create player
    player = this.physics.add.sprite(100, 450, 'walkerShooting');
    player.setCollideWorldBounds(true);

    // create the enemies
    enemy = this.physics.add.sprite(300, 400, 'enemy');
    enemy.setCollideWorldBounds(true);
    this.anims.create({
        key: 'enemyanimation',
        frames: this.anims.generateFrameNumbers('enemy', { start: 25, end: 30 }),
        frameRate: 5,
        repeat: -1
    });
    enemy.anims.play('enemyanimation');

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('walker', { start: 9, end: 17 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'walker', frame: 19 } ],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('walker', { start: 28, end: 32 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: this.anims.generateFrameNumbers('walker', { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'down',
        frames: this.anims.generateFrameNumbers('walker', { start: 18, end: 26 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'shoot-right',
        frames: this.anims.generateFrameNumbers('walkerShooting', { start: 37, end: 48 }),
        frameRate: 50,
        // repeat: -1
    });
    this.anims.create({
        key: 'shoot-left',
        frames: this.anims.generateFrameNumbers('walkerShooting', { start: 13, end: 24 }),
        frameRate: 50,
        // repeat: -1
    });
    this.anims.create({
        key: 'shoot-up',
        frames: this.anims.generateFrameNumbers('walkerShooting', { start: 0, end: 12 }),
        frameRate: 50,
        // repeat: -1
    });
    this.anims.create({
        key: 'shoot-down',
        frames: this.anims.generateFrameNumbers('walkerShooting', { start: 25, end: 36 }),
        frameRate: 50,
        // repeat: -1
    });

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    // for scores
    scoreText = this.add.text(WINDOW_WIDTH/3, WINDOW_HEIGHT - 50, scoreBoardTemplate(0), { fontSize: '32px', fill: '#fff' });

    // for bullet
    bullets = this.physics.add.group({
        defaultKey: 'snowball'
    });
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(20, 'snowball');
    this.physics.add.overlap(bullets, platforms, bulletPlatformCollision, null, this);
    this.physics.add.overlap(bullets, enemy, bulletEnemyCollision, null, this);
}

function update () {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
        lastDirection = 'left';
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
        lastDirection = 'right';
    } else if (cursors.up.isDown) {
        player.setVelocityY(-160);
        player.anims.play('up', true);
        lastDirection = 'up';
    } else if (cursors.down.isDown) {
        player.anims.play('down', true);
        player.setVelocityY(160);
        lastDirection = 'down';
    } else if (cursors.space.isDown) {
        // shoot
        if (!isFired) {
            fire(player.getCenter());
        }
            
    } else {
        player.setVelocityX(0);
        player.setVelocityY(0);
        // player.anims.play('turn');
        console.log('stopped');
        player.anims.stop();
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

// function to update the text score
function updateScore (score) {
    scoreText.setText(scoreBoardTemplate(score));
}

function fire (pointer) {
    isFired = true;
    console.log('here');
    var bullet = bullets.get(pointer.x, pointer.y);
    if (bullet) {
        bullet.setActive(true);
        bullet.setVisible(true);
        switch (lastDirection) {
            case 'up':
                    bullet.body.velocity.y = -bulletVelocity;
                    player.anims.play('shoot-up', true);
                break;
            case 'down':
                    bullet.body.velocity.y = bulletVelocity;
                    player.anims.play('shoot-down', true);
                break;
            case 'right':
                    bullet.body.velocity.x = bulletVelocity;
                    player.anims.play('shoot-right', true);
                break;
            case 'left':
                    bullet.body.velocity.x = -bulletVelocity;
                    player.anims.play('shoot-left', true);
                break;
            default:
                bullet.body.velocity.y = -bulletVelocity;
        }
        // added a settimeout to add delay to the firing
        setTimeout(() => resetFire(), 500);
    }
}

function resetLaser(laser) {
	// Destroy the laser
	laser.kill();
}

function resetFire() {
    isFired = false;
}

function bulletPlatformCollision (bullet, platform) {
    bullet.destroy();
}

function bulletEnemyCollision (bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    updateScore(10);
}

function generateTreeBarriers (x, y, length = 1, horizontal = true) {
    let treeGaps = [20, 30, 40];
    let selectedGap = Math.floor((Math.random(3)*10)%3);
    if (x > WINDOW_WIDTH || y > WINDOW_HEIGHT || length === 0) {
        return;
    }
    platforms.create(x, y, 'snowtrees').setScale(0.7, 0.7).refreshBody();
    if (horizontal) {
        generateTreeBarriers(x + treeGaps[selectedGap], y, length - 1, horizontal);
    } else {
        generateTreeBarriers(x, y + treeGaps[selectedGap], length - 1, horizontal);
    }
}
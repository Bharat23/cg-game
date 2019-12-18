
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var camera;
var transform;

var game = new Phaser.Game(config);

function preload ()
{   
    console.log(this.load.scenePlugin);
    // this.load.scenePlugin('IsoPlugin', 'static/js/phaser-plugin-isometric.js', 'IsoPlugin', 'iso');
    this.load.scenePlugin({
            key: 'IsoPlugin',
            url: 'static/js/phaser-plugin-isometric.js',
            sceneKey: 'iso'
        });

    this.load.image('particle', 'static/assets/snowtrees.png');
}

function create ()
{
    

    //  Our rotation matrix
    // transform = new Phaser.Math.Matrix4().rotateX(-0.01).rotateY(-0.02).rotateZ(0.01);
}

function update () {
    this.isoGroup = this.add.group();
    console.log(this.iso);
    this.iso.projector.origin.setTo(05, 0.3);
    // camera.transformChildren(transform);
    spawnTiles(this);
}

function spawnTiles(that) {
    var tile;

    for (var xx = 0; xx < 256; xx += 38) {
      for (var yy = 0; yy < 256; yy += 38) {
        tile = that.add.isoSprite(xx, yy, 0, 'tile', this.isoGroup);
        tile.setInteractive();

        tile.on('pointerover', function() {
            that.setTint(0x86bfda);
            that.isoZ += 5;
        });

        tile.on('pointerout', function() {
            that.clearTint();
            that.isoZ -= 5;
        });
      }
    }
} 
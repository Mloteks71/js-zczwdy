// Import stylesheets
import "./style.css";
import "phaser";

// Write Javascript code!
const appDiv = document.getElementById("app");

var config = {
  type: Phaser.AUTO,
  width: 480,
  height: 270,
  parent: appDiv,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var game = new Phaser.Game(config);

function preload() {
  this.load.baseURL = "https://examples.phaser.io/assets/";
  this.load.crossOrigin = "anonymous";
  this.load.image("background", "skies/sky4.png");
  this.load.image("platform", "sprites/block.png");
  this.load.image("bullet","bullets/bullet02.png")
  this.load.image("enemy","games/invaders/invader.png")
  this.load.image("star","games/starstruck/star2.png")
  this.load.image("door","games/invaders/starfield.png")
  this.load.spritesheet("player", "games/starstruck/dude.png", {
    frameWidth: 32,
    frameHeight: 48
  });
}

var player, platforms;
var cursors;
var cd;
//var enemy;
var bullets;
var stars;
var gameoverText;
var enemys;
var counter=0;
var counterText;
var door;
var winText;
function cdminus(){if(cd>0)cd--;}
function create() {
  setInterval(cdminus, 400)
  cd =0;
  let back = this.add.tileSprite(0, 0, 480, 270, "background");
  back.setOrigin(0);
  back.setScrollFactor(0); //fixedToCamera = true;
  door = this.physics.add.sprite(500, 250, "door");
  door.setScale(0.1)
  door.setCollideWorldBounds(true);
  this.cameras.main.setBounds(0, 0, 900, 300);
  this.physics.world.setBounds(0, 0, 900, 300);

  player = this.physics.add.sprite(50, 200, "player");
  player.setCollideWorldBounds(true);

  this.cameras.main.startFollow(player);
  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "front",
    frames: [{ key: "player", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  cursors = this.input.keyboard.createCursorKeys();
  platforms = this.physics.add.staticGroup();
  stars = this.physics.add.staticGroup();
  bullets = this.physics.add.group();
  enemys = this.physics.add.group();
  platforms.create(150, 270, "platform");
  platforms.create(400, 270, "platform");
  stars.create(400, 200, "star");
  platforms.getChildren().forEach(c =>
    c
      .setScale(0.3)
      .setOrigin(0)
      .refreshBody()
  );
  this.physics.add.collider(player, platforms);
  let enemy=enemys.create(300,250,"enemy");
  enemy.body.velocity.x=-20;
  enemy.setScale(2);
  enemy.setCollideWorldBounds(true);
  counterText = this.add.text(20, 25,
    counter,
    { font: "30px Arial", fill: "#ffffff", align: "center" });
  counterText.setOrigin(0.5);
  counterText.setScrollFactor(0);
  gameoverText = this.add.text(240, 140,
    'GAME OVER',
    { font: "40px Arial", fill: "#ffffff", align: "center" });
  gameoverText.setOrigin(0.5);
  gameoverText.setScrollFactor(0);
  gameoverText.visible = false;
  winText = this.add.text(240, 140,
    'WYGRAŁEŚ!!!',
    { font: "40px Arial", fill: "#ffffff", align: "center" });
  winText.setOrigin(0.5);
  winText.setScrollFactor(0);
  winText.visible = false;
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-150);
    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(150);
    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);
    player.anims.play("front");
  }
    
  if (
    cursors.up.isDown &&
    (player.body.touching.down || player.body.onFloor())
  ) {
    player.setVelocityY(-250);
  }
  if(cursors.space.isDown)
  {
    if(cd==0)
    {
      if(player.body.velocity.x<0){
      let bullet=bullets.create(player.x-32, player.y, "bullet");
      bullet.body.velocity.x=(-200);
      bullet.body.gravity.y=-500;
      cd=3;
      }
      else
      {
      let bullet=bullets.create(player.x+32, player.y, "bullet");
      bullet.body.velocity.x=200;
      bullet.body.gravity.y=-500;
      cd=3;
      }
    }
  }
  this.physics.collide(bullets, enemys, bulletHitsEnemy);
  this.physics.collide(bullets, platforms, bulletHitsPlatform);
  this.physics.collide(enemys,platforms,enemyHitsPlatform);
  this.physics.overlap(player,stars,playerHitsStar);
  this.physics.overlap(player,enemys,enemyHitsPlayer);
  this.physics.overlap(player,door,playerHitsDoor);
}
function bulletHitsEnemy(bullet, enemy) {
  bullet.disableBody(true, true);
  enemy.disableBody(true, true);
  counter++;
  counterText.text=counter;
}
function bulletHitsPlatform(bullet, platform) {
  bullet.disableBody(true, true);
}
function enemyHitsPlatform(enemy, platform) {
  if(enemy.x>platform.x)enemy.body.velocity.x=20
  else enemy.body.velocity.x=-20
}
function playerHitsStar(player,star)
{
  star.disableBody(true,true)
  counter++;
  counterText.text=counter;
}
function enemyHitsPlayer(player,enemy)
{
  player.disableBody(true,true)
  gameoverText.visible = true;
}
function playerHitsDoor(player,door)
{
  if(counter>1){winText.visible = true;
  player.disableBody(true,true);}
}
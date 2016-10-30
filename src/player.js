"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
const Shot1 = require('./shot1');
const Shot2 = require('./shot2');
const Shot3 = require('./shot3');

/* Constants */
const PLAYER_SPEED = 7;
const BULLET_SPEED = 14;
const SHOT1_TIMER = 200;
const SHOT3_TIMER = 600;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player(bullets, missiles) {
  this.missiles = missiles;
  this.missileCount = 4;
  this.bullets = bullets;
  this.angle = 0;
  this.angle_offset = 0;
  this.position = {x: 200, y: 200};
  this.velocity = {x: 0, y: 0};
  this.img = new Image();
  this.img.src = 'assets/using/ship/ship.png';
  this.guns = new Image();
  this.guns.src = 'assets/using/ship/side_guns.png';
  this.shield = new Image();
  this.shield.src = 'assets/using/ship/shield.png';
  this.shot1s = [];
  this.shot1Timer = SHOT1_TIMER;
  this.shot3Timer = SHOT3_TIMER;
  this.shot1Level = 0;
  this.shot2s = [];
  this.shot3s = [];
  this.shot3Level = 0;
}

Player.prototype.updateShot1 = function(){
  if(this.shot1Level < 3){
    this.shot1Level++;
  }
  else this.shot1Level = 0;

  if(this.shot3Level == 0) this.shot3Level = 1;
  else this.shot3Level = 0;
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {

  // set the velocity
  this.velocity.x = 0;
  if(input.left) this.velocity.x -= PLAYER_SPEED;
  if(input.right) this.velocity.x += PLAYER_SPEED;
  this.velocity.y = 0;
  if(input.up) this.velocity.y -= PLAYER_SPEED / 2;
  if(input.down) this.velocity.y += PLAYER_SPEED;

  // determine player angle
  this.angle = 0;
  if(this.velocity.x < 0) this.angle = -1;
  if(this.velocity.x > 0) this.angle = 1;

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

  // don't let the player move off-screen
  if(this.position.x < 44) this.position.x = 44;
  if(this.position.x > 980) this.position.x = 980;
  if(this.position.y > 750) this.position.y = 750;
  if(this.position.y < 36) this.position.y = 36;

  this.shot1Timer -= elapsedTime;
  this.shot3Timer -= elapsedTime;

  if(input.firing){
    if(this.shot1Timer <= 0){
      this.shot1s.push(new Shot1(this.position, this.shot1Level));
      this.shot2s.push(new Shot2(this.position, -1));
      this.shot2s.push(new Shot2(this.position, 1));
      this.shot1Timer = SHOT1_TIMER;
    }
    if(this.shot3Timer <= 0){
      var posx = this.position.x;
      var posy = this.position.y;
      this.shot3s.push(new Shot3({x: posx + 33, y: posy}, this.shot3Level));
      this.shot3s.push(new Shot3({x: posx - 27, y : posy}, this.shot3Level));
      this.shot3Timer = SHOT3_TIMER;      
    }
  }

  for(var i = 0; i < 30; i++){
    if(this.shot1s[i]){
      this.shot1s[i].update(elapsedTime);
      if(this.shot1s[i].remove)
        this.shot1s.splice(i, 1);
    }
    if(this.shot2s[i]){
      this.shot2s[i].update(elapsedTime);
      if(this.shot2s[i].remove)
        this.shot2s.splice(i, 1);
    }
    if(this.shot3s[i]){
      this.shot3s[i].update(elapsedTime);
      if(this.shot3s[i].remove)
        this.shot3s.splice(i, 1);
    }    
  }
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapsedTime, ctx) {
  var offset = this.angle * 21;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 42+offset, 0, 21, 27, 0, 0, 46, 54);
  ctx.drawImage(this.guns, 0 ,0, 41, 13, -18, 15, 82, 26);  
  ctx.drawImage(this.shield, 0 ,0, 556, 556, -27, -20, 100, 100);  
  ctx.restore();

  for(var i = 0; i < 30; i++){
    if(this.shot1s[i])
    this.shot1s[i].render(elapsedTime, ctx);
    if(this.shot2s[i])
    this.shot2s[i].render(elapsedTime, ctx);
    if(this.shot3s[i])
    this.shot3s[i].render(elapsedTime, ctx);    
  }
}

/**
 * @function fireBullet
 * Fires a bullet
 * @param {Vector} direction
 */
Player.prototype.fireBullet = function(direction) {
  var position = Vector.add(this.position, {x:30, y:30});
  var velocity = Vector.scale(Vector.normalize(direction), BULLET_SPEED);
  this.bullets.add(position, velocity);
}

/**
 * @function fireMissile
 * Fires a missile, if the player still has missiles
 * to fire.
 */
Player.prototype.fireMissile = function() {
  if(this.missileCount > 0){
    var position = Vector.add(this.position, {x:0, y:30})
    var missile = new Missile(position);
    this.missiles.push(missile);
    this.missileCount--;
  }
}

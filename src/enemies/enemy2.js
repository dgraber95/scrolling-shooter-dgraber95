"use strict";

const MOVEMENT = 4;
const MS_PER_FRAME = 1000/50;

/**
 * @module exports the Enemy2 class
 */
module.exports = exports = Enemy2;


/**
 * @constructor Enemy2
 * Creates a new enemy2 object
 * @param {Postition} position object specifying an x and y
 */
function Enemy2(position, startTime) {
  this.startTime = startTime;
  this.worldWidth = 850;
  this.worldHeight = 800;
  this.position = {
    x: position.x,
    y: position.y
  };
  this.image = new Image();
  this.image.src = 'assets/using/enemies/enemy_2.png';
  this.remove = false;
  this.frame = 0;
  this.frameTimer = MS_PER_FRAME;
  this.imgWidth = 24;
  this.imgHeight = 28;
  this.width = 2*this.imgWidth;
  this.height = 2*this.imgHeight;
  this.state = 'default';
}


/**
 * @function updates the enemy2 object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Enemy2.prototype.update = function(time) {
    if(this.state == 'firing'){
        this.frameTimer -= time;
        if(this.frameTimer <= 0){
            this.frameTimer = MS_PER_FRAME;
            this.frame++;
            if(this.frame >= 3){
                // fire a new shot

                this.state = 'default';

                this.frame = 0;
            }
        }
    }

  // Apply movement
  this.position.y += MOVEMENT;

  if(this.position.x < -50 || this.position.x > this.worldWidth + 50 ||
     this.position.y < -50 || this.position.y > this.worldHeight + 50){
    this.remove = true;;
  }
}

/**
 * @function renders the enemy2 into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Enemy2.prototype.render = function(time, ctx) {
    ctx.drawImage(this.image,
                  this.imgWidth*this.frame, 0, this.imgWidth, this.imgHeight,
                  this.position.x, this.position.y, this.width, this.height
                  );  
}
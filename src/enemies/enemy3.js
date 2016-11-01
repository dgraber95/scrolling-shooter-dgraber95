"use strict";

const SPEED = 5;

/**
 * @module exports the Enemy3 class
 */
module.exports = exports = Enemy3;


/**
 * @constructor Enemy3
 * Creates a new enemy3 object
 * @param {Postition} position object specifying an x and y
 */
function Enemy3(position, startTime, type) {
    this.startTime = startTime;
    this.worldWidth = 850;
    this.worldHeight = 800;
    this.type = type; // 0: flies down, 1: right, 2: left
    this.position = {
        x: position.x,
        y: position.y
    };
    this.image = new Image();
    this.image.src = 'assets/using/enemies/enemy_3.png';
    this.remove = false;
    this.imgWidth = 24;
    this.imgHeight = 26;
    this.width = 2*this.imgWidth;
    this.height = 2*this.imgHeight;
}


/**
 * @function updates the enemy3 object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Enemy3.prototype.update = function(time) {
    // Apply velocity
    switch(this.type){
        case 0:
            this.position.y += SPEED;
            break;
        case 1:
            this.position.x += SPEED;
            break;
        case 2:
            this.position.x -= SPEED;
            break;
    }

  if(this.position.x < -50 || this.position.x > this.worldWidth + 50 ||
     this.position.y < -50 || this.position.y > this.worldHeight + 50){
    this.remove = true;;
  }
}

/**
 * @function renders the enemy3 into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Enemy3.prototype.render = function(time, ctx) {
    ctx.drawImage(this.image,
                  this.imgWidth*this.frame, 0, this.imgWidth, this.imgHeight,
                  this.position.x, this.position.y, this.width, this.height
                  );  
}

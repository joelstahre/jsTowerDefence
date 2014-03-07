var J = J || {};

J.Bullet = function (startX, startY, destX, destY, bullets, damage) { 
    this.towerType = J.towerTypes;

    this.x = startX;
    this.y = startY;
    this.destX = destX;
    this.destY = destY;

    this.bullets = bullets;
    this.damage = damage;

    this.speed = 7;
    this.size = 10;

    var angle = Math.atan2(this.destY-this.y, this.destX-this.x); // beräkna vinkeln

    this.xSpeed = Math.cos(angle)*this.speed; // beräkna hur mycket kulan ska förflytta sig horisontalt
    this.ySpeed = Math.sin(angle)*this.speed; // beräkna hur mycket kulan ska förflytta sig vertikalt
}

J.Bullet.prototype.update = function () {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < 0 || this.x > 320 || this.y < 0 || this.y > 320) {
        this.bullets.splice(W.getIndex(this, this.bullets), 1);
    }
}

J.Bullet.prototype.draw = function(ctx){
    
    ctx.fillStyle = "#c70004";
    ctx.fillRect(this.x + this.size, this.y + this.size, this.size, this.size);
  
};


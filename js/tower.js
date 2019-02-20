var J = J || {};

J.Tower = function (x, y, towerArray, towerType, player, enemies, bullets) {

    this.towerTypes = J.TowerTypes;
    this.x = x;
    this.y = y;

    this.player = player;
    this.towers = towerArray;
    this.pointSize = 32;

    this.towerType = towerType;
    this.enemies = enemies;

    this.xOffset = this.x * 32;
    this.yOffset = this.y * 32;

    this.level = 1;
    this.tLevel = document.getElementById("tLevel");
    this.tDamage = document.getElementById("tDamage");
    this.tRange = document.getElementById("tRange");
    this.tUpgradeBtn = document.getElementById("upgradeBTN");

    this.bullets = bullets;
    
 
    // Se TODO lista 9.1
    //this.coolDown = Date.now() + this.towerTypes[towerType].coolDown;
    this.coolDown = Date.now() + 500;
    this.cost = this.towerTypes[towerType].cost;
    this.towerName = this.towerTypes[towerType].name;
    this.damage = this.towerTypes[towerType].damage;
    this.range = this.towerTypes[towerType].range;
    this.sellValue = this.cost * 0.75;
    

   
    this.img = document.getElementById(this.towerTypes[this.towerType].src);
    
    
    this.player.updateCash(this.towerTypes[towerType].cost);    
    

    
};


J.Tower.prototype.upgrade = function () {

    if(this.player.playerCash < this.cost){
        return;
    }
    else {
    
        //Level upgrade
        this.level++;
        this.tLevel.innerHTML = this.level;
    
        //Damage upgrade
        this.damage += Math.floor(Math.pow(this.towerTypes[this.towerType].damage / 5, this.level));
        this.tDamage.innerHTML = this.damage;
        
        
        //Range upgrade
        if(this.level % 3 === 0){
            this.range += this.towerTypes[this.towerType].range;
            this.tRange.innerHTML = this.range / this.pointSize;
        }
        
        // Cost Upgrade
        this.cost = this.cost + 50;
        this.tUpgradeBtn.innerHTML = "$" + this.cost;
        
        this.player.updateCash(this.cost - 50);
    }
};

J.Tower.prototype.sell = function (tower) {
    
    this.towers.splice(tower, 1);
    this.player.addCash(this.sellValue);
};


J.Tower.prototype.update = function() {
    for (var i=0; i<this.enemies.length; i++) {
        var xDist = this.enemies[i].x - this.xOffset;
        var yDist = this.enemies[i].y - this.yOffset;
        var dist = Math.sqrt(xDist * xDist + yDist * yDist);

        if (dist <= this.range) {
            if (Date.now() >= this.coolDown) {
                console.log("Fire");
                this.bullets.push(new J.Bullet(this.xOffset, this.yOffset, this.enemies[i].x, this.enemies[i].y, this.bullets, this.damage));
                this.coolDown = Date.now()+500;
            }
        }
    }
};


J.Tower.prototype.draw = function (ctx) {
    ctx.drawImage(this.img, this.xOffset, this.yOffset, this.pointSize, this.pointSize);
    
};